from typing import Any, List, Optional
from datetime import datetime
from pydantic import BaseModel, EmailStr


# ── Auth ──────────────────────────────────────────────────────────────────────

class UserRegister(BaseModel):
    email: EmailStr
    full_name: str
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str

class GoogleLoginRequest(BaseModel):
    credential: str


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


class InterviewMessage(BaseModel):
    session_id: int
    user_answer: str


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
