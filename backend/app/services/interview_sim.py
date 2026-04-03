"""Interview session state management helpers."""
from sqlalchemy.orm import Session

from app.models.domain import InterviewSession
from app.services import llm_service


def get_or_404(db: Session, session_id: int, user_id: int) -> InterviewSession:
    session = db.query(InterviewSession).filter(
        InterviewSession.id == session_id,
        InterviewSession.user_id == user_id,
    ).first()
    if not session:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Interview session not found.")
    return session


def start_session(db: Session, user_id: int, topic: str) -> InterviewSession:
    opening_question = f"Welcome to your mock interview for **{topic}**. To begin, please briefly introduce yourself and your experience with this topic."
    messages = [{"role": "assistant", "content": opening_question}]

    session = InterviewSession(user_id=user_id, topic=topic, messages=messages)
    db.add(session)
    db.commit()
    db.refresh(session)
    return session
