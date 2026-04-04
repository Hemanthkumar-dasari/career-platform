from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.database import get_db, SessionLocal
from app.models.domain import User, ChatSession
from app.schemas.schemas import ChatRequest, ChatSessionOut
from app.services import llm_service

router = APIRouter()


@router.post("/stream")
def chat_stream(
    payload: ChatRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Get or create session
    if payload.session_id:
        session = db.query(ChatSession).filter(
            ChatSession.id == payload.session_id,
            ChatSession.user_id == current_user.id,
        ).first()
        if not session:
            raise HTTPException(status_code=404, detail="Chat session not found.")
    else:
        # Create a new session — title from first message (truncated)
        title = payload.message[:80].strip() or "New Chat"
        session = ChatSession(user_id=current_user.id, title=title, messages=[])
        db.add(session)
        db.commit()
        db.refresh(session)

    # Build history from existing messages + new user message
    history = list(session.messages or [])
    history.append({"role": "user", "content": payload.message})
    session_id = session.id

    def generator():
        # First yield: session ID so frontend knows it
        yield f"__SESSION_ID__:{session_id}\n"

        full_text = ""
        try:
            for chunk in llm_service.stream_chat_turn(history):
                full_text += chunk
                yield chunk

            # Save messages after stream completes
            db_session = SessionLocal()
            try:
                fresh = db_session.query(ChatSession).filter(
                    ChatSession.id == session_id
                ).first()
                if fresh:
                    msgs = list(fresh.messages or [])
                    msgs.append({"role": "user", "content": payload.message})
                    msgs.append({"role": "assistant", "content": full_text})
                    fresh.messages = msgs
                    db_session.commit()
            finally:
                db_session.close()

        except Exception as e:
            yield f"\n\n**Error**: {str(e)}"

    return StreamingResponse(generator(), media_type="text/plain")


@router.get("/", response_model=list[ChatSessionOut])
def list_sessions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return (
        db.query(ChatSession)
        .filter(ChatSession.user_id == current_user.id)
        .order_by(ChatSession.updated_at.desc())
        .all()
    )


@router.get("/{session_id}", response_model=ChatSessionOut)
def get_session(
    session_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    session = db.query(ChatSession).filter(
        ChatSession.id == session_id,
        ChatSession.user_id == current_user.id,
    ).first()
    if not session:
        raise HTTPException(status_code=404, detail="Chat session not found.")
    return session


@router.delete("/{session_id}", status_code=204)
def delete_session(
    session_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    session = db.query(ChatSession).filter(
        ChatSession.id == session_id,
        ChatSession.user_id == current_user.id,
    ).first()
    if not session:
        raise HTTPException(status_code=404, detail="Chat session not found.")
    db.delete(session)
    db.commit()
    return None
