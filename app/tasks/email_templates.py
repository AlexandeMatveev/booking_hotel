# В app/tasks/email_templates.py
from email.mime.text import MIMEText
from app.bookings.schemas import SBOoking
from app.config import settings
def create_email_message_booking(booking_data, email_to: str):
    """
    Создание текста email для уведомления о бронировании
    """
    # Конвертируем в модель, если пришел словарь
    if isinstance(booking_data, dict):
        booking = SBOoking(**booking_data)
    else:
        booking = booking_data
    
    msg_content = f"""
    Уважаемый пользователь,
    Вы забронировали отель с {booking.date_from} по {booking.date_to}
    Номер бронирования: {booking.id}
    Номер комнаты: {booking.room_id}
    Стоимость: {booking.price}
    Желаем приятного отдыха!
    """
    
    email = MIMEText(msg_content)
    email["Subject"] = "Подтверждение бронирования"
    email["From"] = settings.SMTP_USER
    email["To"] = email_to
    
    return email