from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.database import get_db, SessionLocal
from app.models.domain import User, InterviewSession
from app.schemas.schemas import InterviewStart, InterviewMessage, SessionOut
from app.services import interview_sim, llm_service

router = APIRouter()

@router.post("/start", response_model=SessionOut)
def start_interview(
    payload: InterviewStart,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        session = interview_sim.start_session(db, current_user.id, payload.topic)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Database error: {e}")
    return session


@router.delete("/{session_id}", status_code=204)
def delete_interview(
    session_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    session = db.query(InterviewSession).filter(
        InterviewSession.id == session_id,
        InterviewSession.user_id == current_user.id
    ).first()
    if not session:
        raise HTTPException(status_code=404, detail="Interview session not found.")
    db.delete(session)
    db.commit()
    return None


@router.post("/answer/stream")
def submit_answer_stream(
    payload: InterviewMessage,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    session = interview_sim.get_or_404(db, payload.session_id, current_user.id)
    history = session.messages or []

    def generator():
        full_text = ""
        try:
            for chunk in llm_service.stream_interview_turn(
                topic=session.topic,
                history=history,
                user_answer=payload.user_answer
            ):
                full_text += chunk
                yield chunk

            db_session = SessionLocal()
            try:
                fresh_session = db_session.query(InterviewSession).filter(
                    InterviewSession.id == payload.session_id
                ).first()
                if fresh_session:
                    history_new = list(fresh_session.messages or [])
                    if payload.user_answer:
                        history_new.append({"role": "user", "content": payload.user_answer})
                    else:
                        history_new.append({"role": "user", "content": f"Start the interview on topic: {fresh_session.topic}"})
                    history_new.append({"role": "assistant", "content": full_text})
                    fresh_session.messages = history_new
                    db_session.commit()
            finally:
                db_session.close()

        except Exception as e:
            yield f"\n\n**Error during stream**: {str(e)}"

    return StreamingResponse(generator(), media_type="text/plain")


@router.post("/{session_id}/evaluate/stream")
def evaluate_interview_stream(
    session_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    session = interview_sim.get_or_404(db, session_id, current_user.id)
    history = session.messages or []

    def generator():
        full_text = ""
        try:
            for chunk in llm_service.stream_interview_evaluation(history):
                full_text += chunk
                yield chunk

            db_session = SessionLocal()
            try:
                fresh_session = db_session.query(InterviewSession).filter(
                    InterviewSession.id == session_id
                ).first()
                if fresh_session:
                    fresh_session.evaluation = full_text
                    db_session.commit()
            finally:
                db_session.close()

        except Exception as e:
            yield f"\n\n**Error during evaluation**: {str(e)}"

    return StreamingResponse(generator(), media_type="text/plain")


@router.get("/", response_model=list[SessionOut])
def list_sessions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return db.query(InterviewSession).filter(
        InterviewSession.user_id == current_user.id
    ).all()


@router.get("/{session_id}", response_model=SessionOut)
def get_session(
    session_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return interview_sim.get_or_404(db, session_id, current_user.id)