from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship

from app.db.base import Base


def utcnow():
    return datetime.now(timezone.utc)


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    full_name = Column(String(255), nullable=False)
    hashed_password = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=utcnow)

    learning_paths = relationship("LearningPath", back_populates="owner", cascade="all, delete")
    resumes = relationship("ResumeAnalysis", back_populates="owner", cascade="all, delete")
    interview_sessions = relationship("InterviewSession", back_populates="owner", cascade="all, delete")
    project_ideas = relationship("ProjectIdea", back_populates="owner", cascade="all, delete")


class ProjectIdea(Base):
    __tablename__ = "project_ideas"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    tech_stack = Column(String(255))
    difficulty = Column(String(50))
    content = Column(Text)  # The generated project ideas (Markdown)
    created_at = Column(DateTime, default=utcnow)

    owner = relationship("User", back_populates="project_ideas")


class LearningPath(Base):
    __tablename__ = "learning_paths"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    current_skills = Column(Text)
    target_job = Column(String(255))
    milestones = Column(JSON)  # JSON array of milestone objects
    created_at = Column(DateTime, default=utcnow)

    owner = relationship("User", back_populates="learning_paths")


class ResumeAnalysis(Base):
    __tablename__ = "resume_analyses"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    filename = Column(String(255))
    target_role = Column(String(255))
    extracted_text = Column(Text)
    feedback = Column(JSON)  # {strengths, weaknesses, formatting_score, action_items}
    created_at = Column(DateTime, default=utcnow)

    owner = relationship("User", back_populates="resumes")


class InterviewSession(Base):
    __tablename__ = "interview_sessions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    topic = Column(String(255))
    messages = Column(JSON, default=list)  # [{role, content}]
    evaluation = Column(Text)  # The final performance review (Markdown)
    created_at = Column(DateTime, default=utcnow)
    updated_at = Column(DateTime, default=utcnow, onupdate=utcnow)

    owner = relationship("User", back_populates="interview_sessions")
