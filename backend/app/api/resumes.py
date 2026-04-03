from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.database import get_db, SessionLocal
from app.models.domain import User, ResumeAnalysis
from app.schemas.schemas import ResumeOut
from app.services import llm_service
from app.services import resume_parser

router = APIRouter()

@router.post("/analyze/stream")
def analyze_resume_stream(
    target_role: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
        
    extracted_text = resume_parser.extract_text(file.file)

    def generator():
        full_text = ""
        try:
            for chunk in llm_service.stream_resume_analysis(
                extracted_text=extracted_text,
                target_role=target_role,
            ):
                full_text += chunk
                yield chunk
                
            db_session = SessionLocal()
            try:
                analysis = ResumeAnalysis(
                    user_id=current_user.id,
                    filename=file.filename,
                    target_role=target_role,
                    extracted_text=extracted_text,
                    feedback={"markdown": full_text},
                )
                db_session.add(analysis)
                db_session.commit()
            finally:
                db_session.close()
                
        except Exception as e:
            yield f"\n\n**Error during analysis**: {str(e)}"

    return StreamingResponse(generator(), media_type="text/plain")


@router.get("/", response_model=list[ResumeOut])
def list_resumes(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return db.query(ResumeAnalysis).filter(
        ResumeAnalysis.user_id == current_user.id
    ).order_by(ResumeAnalysis.created_at.desc()).all()


@router.get("/{resume_id}", response_model=ResumeOut)
def get_resume(
    resume_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    resume = db.query(ResumeAnalysis).filter(
        ResumeAnalysis.id == resume_id, 
        ResumeAnalysis.user_id == current_user.id
    ).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume analysis not found.")
    return resume


@router.delete("/{resume_id}", status_code=204)
def delete_resume(
    resume_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    resume = db.query(ResumeAnalysis).filter(
        ResumeAnalysis.id == resume_id, 
        ResumeAnalysis.user_id == current_user.id
    ).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume analysis not found.")
    db.delete(resume)
    db.commit()
    return None
