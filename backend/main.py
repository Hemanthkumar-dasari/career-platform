from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import auth, paths, projects, resumes, interviews, stats, chat
from app.db.database import engine
from app.db import base  # noqa: F401 – registers all models with metadata
from app.models import domain  # noqa: F401

from app.core.config import settings

app = FastAPI(
    title="AI Career Guidance Platform",
    description="AI-powered career guidance: learning paths, project ideas, resume analysis, and mock interviews.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://career-platform-theta.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create tables on startup
from app.db.base import Base
Base.metadata.create_all(bind=engine)

# Routers
app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(paths.router, prefix="/api/paths", tags=["Learning Paths"])
app.include_router(projects.router, prefix="/api/projects", tags=["Project Ideas"])
app.include_router(resumes.router, prefix="/api/resumes", tags=["Resume Analyzer"])
app.include_router(interviews.router, prefix="/api/interviews", tags=["Interview Simulator"])
app.include_router(stats.router, prefix="/api/stats", tags=["Stats"])
app.include_router(chat.router, prefix="/api/chat", tags=["Chat"])


@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "ok", "service": "AI Career Guidance Platform"}
