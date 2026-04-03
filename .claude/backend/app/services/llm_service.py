"""Central LLM service – wraps Groq for all AI features."""
import json
import re
from typing import Any, Generator

from groq import Groq

from app.core.config import settings

_client: Groq | None = None


def _get_client() -> Groq:
    global _client
    if _client is None:
        _client = Groq(api_key=settings.GROQ_API_KEY)
    return _client


def _stream_chat(system: str, user: str, max_tokens: int = 2048) -> Generator[str, None, None]:
    client = _get_client()
    stream = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        max_tokens=max_tokens,
        messages=[
            {"role": "system", "content": system},
            {"role": "user", "content": user}
        ],
        stream=True,
    )
    for chunk in stream:
        text = chunk.choices[0].delta.content
        if text:
            yield text


def stream_interview_evaluation(history: list) -> Generator[str, None, None]:
    return _stream_chat(INTERVIEW_FEEDBACK_SYSTEM, json.dumps(history), max_tokens=3000)


def _chat(system: str, user: str, max_tokens: int = 2048) -> str:
    """Non-streaming fallback if ever needed."""
    client = _get_client()
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        max_tokens=max_tokens,
        messages=[
            {"role": "system", "content": system},
            {"role": "user", "content": user}
        ],
    )
    return response.choices[0].message.content


# ── Roadmap Generation ────────────────────────────────────────────────────────

ROADMAP_SYSTEM = """You are an expert career advisor and software engineer mentor.
Given a user's current skills and their target job role, generate a detailed, realistic
weekly learning roadmap.

ALWAYS structure your response as follows:
## 📌 Summary
A 1-2 sentence TL;DR of the learning strategy.

## 🔑 Key Points
3-5 bullet points on the most important concepts to master.

## ✅ Action Steps
The detailed weekly roadmap (using Week X headings inside this section).

## 📚 Resource
One well-known, verifiable book or tool recommendation (No URLs).

Output in beautifully formatted Markdown. Keep it concise and actionable."""


def stream_roadmap(current_skills: str, target_job: str) -> Generator[str, None, None]:
    user_msg = f"Current skills: {current_skills}\nTarget job: {target_job}"
    return _stream_chat(ROADMAP_SYSTEM, user_msg, max_tokens=3000)


# ── Project Ideas ─────────────────────────────────────────────────────────────

PROJECTS_SYSTEM = """You are a world-class senior software engineer and mentor. 
Your goal is to provide high-detail, beginner-friendly portfolio project ideas.

For EACH project idea you generate, you MUST follow this EXACT 4-section structure. 

## 📌 Summary
A catchy title and exactly 2 detailed lines explaining the project's purpose and "why" it's great for a beginner. Include the Tech Stack here as well.

## 🔑 Key Points
A detailed list of 3-5 core functionalities. Explain WHAT each feature does and WHY it helps the user learn.

## ✅ Action Steps
A highly detailed, numbered step-by-step build guide. Break it down into logical phases (e.g., Environment Setup, Data Model, UI, Logic).

## 📚 Resource
Provide exactly one well-known, verifiable book, official documentation, or popular tool. (IMPORTANT: No URLs).

Output in beautifully formatted Markdown."""


def stream_project_ideas(tech_stack: str, difficulty: str, count: int = 3) -> Generator[str, None, None]:
    user_msg = f"Tech stack: {tech_stack}\nDifficulty: {difficulty}\nNumber of projects: {count}"
    return _stream_chat(PROJECTS_SYSTEM, user_msg, max_tokens=3000)


# ── Resume Feedback ───────────────────────────────────────────────────────────

RESUME_SYSTEM = """You are an expert technical recruiter and career coach with 15 years of experience.
Analyze the provided resume text for the given target role and provide structured feedback.

ALWAYS structure your response as follows:
## 📌 Summary
A 1-2 sentence TL;DR of the resume's overall quality and fit.

## 🔑 Key Points
3-5 bullet points highlighting major strengths and critical gaps. Include a **Formatting Score (out of 100)** here.

## ✅ Action Steps
Numbered list of concrete improvements (e.g., phrasing, layout, missing keywords).

## 📚 Resource
One well-known, verifiable book or resume-building tool recommendation (No URLs).

Output in beautifully formatted Markdown. Include a **Formatting Score (out of 100)** within the Key Points."""

GENERAL_SYSTEM = """You are an expert career guidance AI assistant. 
Respond to general career queries, job search questions, or soft skill advice.

ALWAYS structure your response as follows:
## 📌 Summary
A 1-2 sentence TL;DR of your answer.

## 🔑 Key Points
3-5 bullet points with the most important advice.

## ✅ Action Steps
Numbered list of concrete next steps the user can take.

## 📚 Resource
One well-known, verifiable book, course, or tool recommendation (No URLs).

Keep each section short, clear, and actionable. Avoid long paragraphs."""


def stream_resume_analysis(extracted_text: str, target_role: str) -> Generator[str, None, None]:
    user_msg = f"Target role: {target_role}\n\nResume text:\n{extracted_text}"
    return _stream_chat(RESUME_SYSTEM, user_msg, max_tokens=3000)


# ── Interview Simulation ──────────────────────────────────────────────────────

INTERVIEW_SYSTEM = """You are a seasoned technical interviewer conducting a mock interview.
Your job is to:
1. Ask one focused technical question at a time relevant to the topic.
2. Maintain a professional, encouraging, yet challenging tone.
3. Keep your responses concise and focused ONLY on the interview conversation.

Do NOT provide evaluations or feedback during the conversation. 
Wait for the candidate's answer, then pivot to the next question or ask a follow-up.
Output in beautifully formatted Markdown."""

INTERVIEW_FEEDBACK_SYSTEM = """You are an expert technical recruiter and interviewer.
Analyze the provided interview transcript and provide a final evaluation.

ALWAYS structure your response as follows:
1. **Summary Box**: A 1-2 sentence TL;DR of the candidate's overall performance.
2. **Key Points**: 3-5 bullet points highlighting technical strengths and specific knowledge gaps.
3. **Action Steps**: Numbered list of concrete steps to improve their interview performance.
4. **Resource Tip**: One well-known, verifiable book or tool recommendation (No URLs).

Output in beautifully formatted Markdown."""


def stream_interview_turn(topic: str, history: list, user_answer: str = "") -> Generator[str, None, None]:
    client = _get_client()
    messages = [{"role": "system", "content": INTERVIEW_SYSTEM}]
    messages.extend(history)
    if user_answer:
        messages.append({"role": "user", "content": user_answer})
    else:
        messages.append({"role": "user", "content": f"Start the interview on topic: {topic}"})

    stream = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        max_tokens=1024,
        messages=messages,
        stream=True,
    )
    for chunk in stream:
        text = chunk.choices[0].delta.content
        if text:
            yield text