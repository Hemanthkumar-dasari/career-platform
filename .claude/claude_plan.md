# AI-Powered Career Guidance Platform - Implementation Plan

This document serves as the master implementation plan for building an AI-powered career guidance platform. It is designed to be read and executed by Claude Code.

## 1. System Architecture

### Frontend
- **Framework:** React 18, bootstrapped with Vite for high performance.
- **Styling:** TailwindCSS for rapid, responsive layout creation.
- **State Management:** React Context API (or Zustand for simplicity).
- **Routing:** React Router DOM (v6+).
- **API Communication:** Axios or standard Fetch API, using a centralized API client module.

### Backend
- **Framework:** FastAPI (Python) for asynchronous endpoints and automatic interactive documentation (Swagger UI).
- **Database ORM:** SQLAlchemy with Alembic for migrations.
- **Database:** PostgreSQL (or SQLite for rapid prototyping, migrating to Postgres for deployment).
- **Authentication:** JWT (JSON Web Tokens) with standard OAuth2 password flow implemented.
- **AI/LLM Integration:** Direct Anthropic/OpenAI SDK and LangChain for prompts and chain handling.
- **NLP & Parsing:** `PyMuPDF` (fitz) or `pdfplumber` for resume PDF text extraction, coupled with LLM analysis.

### Infrastructure
- **Containerization:** Docker for independent services (Frontend and Backend).
- **Orchestration:** Docker Compose to run the entire stack locally.

---

## 2. Directory Structure

Please create the following directory structure precisely:

```text
.
├── .env                  # Global environment variables (API keys, DB URIs)
├── docker-compose.yml    # Orchestrates frontend, backend, and DB
├── README.md             # Project documentation
├── backend/
│   ├── .env              # Backend-specific env variables (if needed)
│   ├── Dockerfile
│   ├── requirements.txt  # Python dependencies
│   ├── main.py           # FastAPI application entrypoint
│   └── app/
│       ├── __init__.py
│       ├── api/          # API routes/controllers
│       │   ├── __init__.py
│       │   ├── auth.py
│       │   ├── paths.py  # GenAI Learning paths
│       │   ├── projects.py
│       │   ├── resumes.py
│       │   └── interviews.py
│       ├── core/         # Config, security, constraints
│       │   ├── config.py
│       │   └── security.py
│       ├── db/           # Database setup and sessions
│       │   ├── database.py
│       │   └── base.py
│       ├── models/       # SQLAlchemy DB models
│       │   └── domain.py # User, Resume, Path schemas
│       ├── schemas/      # Pydantic validation schemas
│       │   └── schemas.py
│       └── services/     # Business logic & AI Integrations
│           ├── llm_service.py     # Base LLM interactions
│           ├── resume_parser.py   # PDF rendering and extraction
│           └── interview_sim.py   # State tracking for mock interviews
└── frontend/
    ├── .env              # VITE_API_URL and exposed configs
    ├── Dockerfile
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── index.html
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── api/          # Axios config and API calls
        ├── assets/       # Static media
        ├── components/   # Reusable UI piece
        │   ├── layout/   # Sidebar, Navbar, Page Wrapper
        │   └── shared/   # Buttons, Inputs, Cards, Loader
        ├── context/      # Global Auth & Theme states
        ├── pages/        # Main route views
        │   ├── Home.jsx
        │   ├── Login.jsx
        │   ├── Dashboard.jsx
        │   ├── LearningPaths.jsx
        │   ├── ProjectIdeas.jsx
        │   ├── ResumeAnalyzer.jsx
        │   └── InterviewPrep.jsx
        └── utils/        # Helper functions
```

---

## 3. Implementation Steps

Follow these phases sequentially. **Do not move to the next phase until the current one is fully functional.**

### Phase 1: Setup and Infrastructure Initialization
1. Initialize the root directory and create the `backend` and `frontend` folders.
2. **Frontend:** Run Vite React initialization. Install TailwindCSS, React Router DOM, and Axios.
3. **Backend:** Set up a Python virtual environment. Create `requirements.txt` (FastAPI, uvicorn, sqlalchemy, pydantic, pyjwt, python-multipart, python-dotenv). Initialize `main.py` with a simple `/health` endpoint.
4. **Docker:** Create `Dockerfile`s in both directories. Create `docker-compose.yml` in the root to wire up the frontend, backend, and a PostgreSQL database. Verify the stack builds and runs.

### Phase 2: Database & Authentication
1. **Backend Models:** Create SQLAlchemy models for Users. Set up the DB connection script.
2. **Backend Auth:** Implement password hashing (bcrypt) and JWT generation logic in `core/security.py`.
3. **Auth API:** Create `/api/auth/register` and `/api/auth/login` endpoints. Protect standard endpoints.
4. **Frontend Auth:** Implement Login/Registration forms. Store JWT in localStorage/Context. Create a PrivateRoute wrapper for protected pages.

### Phase 3: AI Service Integration Layer (Backend)
1. **LLM Connection:** In `services/llm_service.py`, set up the SDK connection utilizing API keys from `.env`.
2. **Prompt Engineering:** Define rigid system prompts for:
   - *Roadmap Generation:* Input (current skills, target job) -> Output (JSON array of milestones).
   - *Project Ideas:* Input (tech stack, difficulty) -> Output (JSON array of project specs).
   - *Resume Feedback:* Input (extracted text, target role) -> Output (JSON containing strengths, weaknesses, formatting score, and action items).
3. **PDF Parser:** Implement `services/resume_parser.py` using a lightweight library to extract raw string data from uploaded PDFs.

### Phase 4: Core Feature Endpoints (Backend APIs)
1. Build `api/paths.py` to handle requests for creating and saving learning paths.
2. Build `api/projects.py` to retrieve targeted project recommendations.
3. Build `api/resumes.py` with a `FileResponse` upload handler. Pipe the file to the parser, pass the text to the LLM service, and return the structured JSON feedback.
4. Build `api/interviews.py` utilizing basic state persistence (in DB or memory) to allow back-and-forth technical Q&A simulating an interviewer.

### Phase 5: Frontend Feature Implementation
1. **Layout:** Build a main layout with a sidebar navigation system allowing access to the 4 core tools.
2. **Roadmap Builder:** Create a form for user goals. Create a visual timeline/roadmap component to display the LLM's returned path.
3. **Project Generator:** Build a card grid view displaying generated project ideas with requirements and suggested architecture.
4. **Resume Analyzer:** Build a drag-and-drop file upload zone. Implement a sleek loading state (e.g., "Analyzing your profile..."). Render the results using progress bars for scores and styled bullet lists for feedback.
5. **Interview Simulator:** Build a chat interface. The system prompts the first technical question, the user types an answer, and the system replies with evaluation and the next question.

### Phase 6: Polish and Validation
1. Traverse all components to ensure responsive design (Tailwind classes).
2. Wire up global error handling (toast notification components for API failures).
3. Ensure no placeholder text remains.
4. Finalize Docker orchestration and test full user flow from registration -> resume upload -> interview from scratch.

> **Instruction for Claude Code:**
> Once you read this file, begin by executing Phase 1. Ensure you verify that things compile locally before proceeding to successive phases. Maintain strict adherence to the directory structure.
