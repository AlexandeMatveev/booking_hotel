

from app.tasks.celery import celery

from pydantic import EmailStr
from pathlib import Path

from app.tasks.email_templates import create_email_message_booking


from app.config import settings

import smtplib 


@celery.task
def send_booking_email(
    booking:dict,
    email_to: EmailStr,

):
    
    email_to_mock = settings.SMTP_USER
    msg_content = create_email_message_booking(booking,email_to_mock)

    with smtplib.SMTP_SSL(settings.SMTP_HOST,settings.SMTP_PORT) as server:
        server.login(settings.SMTP_USER,settings.SMTP_PASS)

        server.send_message(msg_content)