import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.core.config import settings
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

class SupportRequest(BaseModel):
    name: str = ""
    email: str
    message: str

@router.post("/")
def submit_support_request(req: SupportRequest):
    if not settings.SMTP_EMAIL or not settings.SMTP_PASSWORD:
        logger.error("SMTP configuration missing on server.")
        raise HTTPException(status_code=500, detail="SMTP configuration missing on server.")

    sender_email = settings.SMTP_EMAIL
    receiver_email = "dasarihemanth039@gmail.com"
    password = settings.SMTP_PASSWORD

    msg = MIMEMultipart()
    msg['From'] = sender_email
    msg['To'] = receiver_email
    msg['Subject'] = f"Support Request from {req.name or req.email}"

    body = f"Name: {req.name}\nEmail: {req.email}\n\nMessage:\n{req.message}"
    msg.attach(MIMEText(body, 'plain'))

    try:
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(sender_email, password)
        server.send_message(msg)
        server.quit()
    except Exception as e:
        logger.error(f"Failed to send email: {e}")
        raise HTTPException(status_code=500, detail="Failed to send email")
    
    return {"status": "success", "message": "Support request submitted"}
