from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.database import get_db, SessionLocal
from app.models.domain import User, ProjectIdea
from app.schemas.schemas import ProjectRequest, ProjectHistoryOut
from app.services import llm_service

router = APIRouter()

@router.post("/generate/stream")
def generate_projects_stream(
    payload: ProjectRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    def generator():
        full_text = ""
        try:
            for chunk in llm_service.stream_project_ideas(
                tech_stack=payload.tech_stack,
                difficulty=payload.difficulty,
            ):
                full_text += chunk
                yield chunk
            
            # Save the project ideas history
            db_session = SessionLocal()
            try:
                history = ProjectIdea(
                    user_id=current_user.id,
                    tech_stack=payload.tech_stack,
                    difficulty=payload.difficulty,
                    content=full_text
                )
                db_session.add(history)
                db_session.commit()
            finally:
                db_session.close()
                
        except Exception as e:
            yield f"\n\n**Error**: {str(e)}"

    return StreamingResponse(generator(), media_type="text/plain")


@router.get("/", response_model=list[ProjectHistoryOut])
def list_project_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return db.query(ProjectIdea).filter(ProjectIdea.user_id == current_user.id).order_by(ProjectIdea.created_at.desc()).all()


@router.delete("/{project_id}", status_code=204)
def delete_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    project = db.query(ProjectIdea).filter(
        ProjectIdea.id == project_id, ProjectIdea.user_id == current_user.id
    ).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project idea not found.")
    db.delete(project)
    db.commit()
    return None
