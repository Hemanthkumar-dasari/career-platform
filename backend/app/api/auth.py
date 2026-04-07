from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
import io
import csv

from app.api.deps import get_current_user
from app.core.rate_limiter import limiter
from app.core.security import hash_password, verify_password, create_access_token
from app.db.database import get_db
from app.models.domain import User, LearningPath, ResumeAnalysis, ProjectIdea, InterviewSession
from app.schemas.schemas import UserRegister, UserLogin, TokenOut, UserOut, GoogleLoginRequest
from app.core.config import settings
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

router = APIRouter()


@router.post("/google", response_model=TokenOut)
@limiter.limit("5/15minutes")
def google_login(request: Request, payload: GoogleLoginRequest, db: Session = Depends(get_db)):
    try:
        id_info = id_token.verify_oauth2_token(
            payload.credential,
            google_requests.Request(),
            settings.GOOGLE_CLIENT_ID
        )
        email = id_info['email']
        full_name = id_info.get('name', '')
        user = db.query(User).filter(User.email == email).first()

        if not user:
            user = User(email=email, full_name=full_name, hashed_password=None)
            db.add(user)
            db.commit()
            db.refresh(user)

        token = create_access_token({"sub": str(user.id)})
        return TokenOut(access_token=token, user=UserOut.model_validate(user))
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=401, detail="Google authentication failed.")


@router.patch("/profile", response_model=UserOut)
def update_profile(
    full_name: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    current_user.full_name = full_name.strip()[:100]
    db.commit()
    db.refresh(current_user)
    return current_user


@router.delete("/me", status_code=status.HTTP_204_NO_CONTENT)
def delete_account(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db.delete(current_user)
    db.commit()
    return None


@router.get("/export")
def export_data(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    output = io.StringIO()
    writer = csv.writer(output)

    # Export summary of all user data
    writer.writerow(["Entity Type", "Title/Target", "Created At", "Details"])

    paths = db.query(LearningPath).filter(LearningPath.user_id == current_user.id).all()
    for p in paths:
        writer.writerow(["Learning Path", p.target_job, p.created_at, "Steps generated"])

    resumes = db.query(ResumeAnalysis).filter(ResumeAnalysis.user_id == current_user.id).all()
    for r in resumes:
        writer.writerow(["Resume Analysis", r.target_role, r.created_at, r.filename])

    interviews = db.query(InterviewSession).filter(InterviewSession.user_id == current_user.id).all()
    for i in interviews:
        writer.writerow(["Interview Session", i.topic, i.created_at, f"Score: {i.evaluation.get('score', 'N/A') if i.evaluation else 'N/A'}"])

    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=career_data_export.csv"}
    )


@router.post("/register", response_model=TokenOut, status_code=status.HTTP_201_CREATED)
@limiter.limit("5/15minutes")
def register(request: Request, payload: UserRegister, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered.")
    user = User(
        email=payload.email,
        full_name=payload.full_name,
        hashed_password=hash_password(payload.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    token = create_access_token({"sub": str(user.id)})
    return TokenOut(access_token=token, user=UserOut.model_validate(user))


@router.post("/login", response_model=TokenOut)
@limiter.limit("5/15minutes")
def login(request: Request, payload: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password.")
    token = create_access_token({"sub": str(user.id)})
    return TokenOut(access_token=token, user=UserOut.model_validate(user))
