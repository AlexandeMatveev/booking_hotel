# app/worker.py

from celery import Celery
from app.config import settings



# Настройка Celery
celery = Celery(
    "tasks",
    broker="redis://localhost:6379",      # Очередь
    include =["app.tasks.tasks"],     # Результаты
   
)

