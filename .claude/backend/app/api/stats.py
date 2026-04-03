from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.database import get_db
from app.models.domain import User, LearningPath, ResumeAnalysis, InterviewSession, ProjectIdea

router = APIRouter()


@router.get("/")
def get_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return {
        "paths": db.query(LearningPath).filter(LearningPath.user_id == current_user.id).count(),
        "resumes": db.query(ResumeAnalysis).filter(ResumeAnalysis.user_id == current_user.id).count(),
        "interviews": db.query(InterviewSession).filter(InterviewSession.user_id == current_user.id).count(),
        "projects": db.query(ProjectIdea).filter(ProjectIdea.user_id == current_user.id).count(),
    }
