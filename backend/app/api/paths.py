import json
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.database import get_db, SessionLocal
from app.models.domain import User, LearningPath
from app.schemas.schemas import PathRequest, PathOut
from app.services import llm_service

router = APIRouter()

@router.post("/generate/stream")
def generate_path_stream(
    payload: PathRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    def generator():
        full_text = ""
        try:
            for chunk in llm_service.stream_roadmap(
                current_skills=payload.current_skills,
                target_job=payload.target_job,
            ):
                full_text += chunk
                yield chunk
                
            # After streaming finishes, save the markdown to the database
            db_session = SessionLocal()
            try:
                path = LearningPath(
                    user_id=current_user.id,
                    title=f"Path to {payload.target_job}",
                    current_skills=payload.current_skills,
                    target_job=payload.target_job,
                    milestones={"markdown": full_text},
                )
                db_session.add(path)
                db_session.commit()
            finally:
                db_session.close()
                
        except Exception as e:
            yield f"\n\n**Error during generation**: {str(e)}"

    return StreamingResponse(generator(), media_type="text/plain")


@router.get("/", response_model=list[PathOut])
def list_paths(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return db.query(LearningPath).filter(LearningPath.user_id == current_user.id).all()


@router.get("/{path_id}", response_model=PathOut)
def get_path(
    path_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    path = db.query(LearningPath).filter(
        LearningPath.id == path_id, LearningPath.user_id == current_user.id
    ).first()
    if not path:
        raise HTTPException(status_code=404, detail="Learning path not found.")
    return path


@router.delete("/{path_id}", status_code=204)
def delete_path(
    path_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    path = db.query(LearningPath).filter(
        LearningPath.id == path_id, LearningPath.user_id == current_user.id
    ).first()
    if not path:
        raise HTTPException(status_code=404, detail="Learning path not found.")
    db.delete(path)
    db.commit()
    return None
