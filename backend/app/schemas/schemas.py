from typing import Any, List, Optional
from datetime import datetime
from pydantic import BaseModel, EmailStr, field_validator

from app.core.validators import sanitize_str


# ── Auth ──────────────────────────────────────────────────────────────────────

class UserRegister(BaseModel):
    email: EmailStr
    full_name: str
    password: str

    @field_validator("full_name")
    @classmethod
    def validate_full_name(cls, v: str) -> str:
        return sanitize_str(v, max_len=100, field_name="full_name")

    @field_validator("password")
    @classmethod
    def validate_password(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError("password must be at least 8 characters.")
        if len(v) > 128:
            raise ValueError("password must be at most 128 characters.")
        return v


class UserLogin(BaseModel):
    email: EmailStr
    password: str

    @field_validator("password")
    @classmethod
    def validate_password(cls, v: str) -> str:
        if len(v) > 128:
            raise ValueError("password must be at most 128 characters.")
        return v


class GoogleLoginRequest(BaseModel):
    credential: str

    @field_validator("credential")
    @classmethod
    def validate_credential(cls, v: str) -> str:
        v = v.strip()
        if len(v) > 4096:
            raise ValueError("credential token is too large.")
        return v


class UserOut(BaseModel):
    id: int
    email: str
    full_name: str

    model_config = {"from_attributes": True}


class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


# ── Learning Paths ────────────────────────────────────────────────────────────

class PathRequest(BaseModel):
    current_skills: str
    target_job: str

    @field_validator("current_skills")
    @classmethod
    def validate_current_skills(cls, v: str) -> str:
        return sanitize_str(v, max_len=2000, field_name="current_skills")

    @field_validator("target_job")
    @classmethod
    def validate_target_job(cls, v: str) -> str:
        return sanitize_str(v, max_len=200, field_name="target_job")


class Milestone(BaseModel):
    week: int
    title: str
    description: str
    resources: List[str] = []


class PathOut(BaseModel):
    id: int
    title: str
    current_skills: str
    target_job: str
    milestones: Any

    model_config = {"from_attributes": True}


# ── Project Ideas ─────────────────────────────────────────────────────────────

class ProjectRequest(BaseModel):
    tech_stack: str
    difficulty: str  # beginner | intermediate | advanced
    count: int = 3

    @field_validator("tech_stack")
    @classmethod
    def validate_tech_stack(cls, v: str) -> str:
        return sanitize_str(v, max_len=500, field_name="tech_stack")

    @field_validator("difficulty")
    @classmethod
    def validate_difficulty(cls, v: str) -> str:
        allowed = {"beginner", "intermediate", "advanced"}
        v = v.strip().lower()
        if v not in allowed:
            raise ValueError(f"difficulty must be one of: {', '.join(allowed)}.")
        return v

    @field_validator("count")
    @classmethod
    def validate_count(cls, v: int) -> int:
        if v < 1 or v > 10:
            raise ValueError("count must be between 1 and 10.")
        return v


class ProjectIdea(BaseModel):
    title: str
    description: str
    tech_stack: List[str]
    difficulty: str
    suggested_architecture: str
    learning_outcomes: List[str]


class ProjectsOut(BaseModel):
    projects: List[ProjectIdea]


class ProjectHistoryOut(BaseModel):
    id: int
    tech_stack: Optional[str]
    difficulty: Optional[str]
    content: str
    created_at: datetime

    model_config = {"from_attributes": True}


# ── Resume ────────────────────────────────────────────────────────────────────

class ResumeFeedback(BaseModel):
    strengths: List[str]
    weaknesses: List[str]
    formatting_score: int  # 0-100
    action_items: List[str]
    overall_summary: str


class ResumeOut(BaseModel):
    id: int
    filename: str
    target_role: str
    feedback: Any

    model_config = {"from_attributes": True}


# ── Interviews ────────────────────────────────────────────────────────────────

class InterviewStart(BaseModel):
    topic: str  # e.g. "Python backend", "React frontend"

    @field_validator("topic")
    @classmethod
    def validate_topic(cls, v: str) -> str:
        return sanitize_str(v, max_len=200, field_name="topic")


class InterviewMessage(BaseModel):
    session_id: int
    user_answer: str

    @field_validator("user_answer")
    @classmethod
    def validate_user_answer(cls, v: str) -> str:
        return sanitize_str(v, max_len=4000, field_name="user_answer")


class InterviewTurn(BaseModel):
    evaluation: str
    next_question: str
    session_id: int


class SessionOut(BaseModel):
    id: int
    topic: str
    messages: List[Any]
    evaluation: Optional[str]

    model_config = {"from_attributes": True}


# ── Chat ──────────────────────────────────────────────────────────────────────

class ChatRequest(BaseModel):
    session_id: Optional[int] = None
    message: str

    @field_validator("message")
    @classmethod
    def validate_message(cls, v: str) -> str:
        return sanitize_str(v, max_len=8000, field_name="message")


class ChatSessionOut(BaseModel):
    id: int
    title: str
    messages: List[Any]
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = {"from_attributes": True}
