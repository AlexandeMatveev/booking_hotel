from datetime import date
from app.dao.base import BaseDAO
from app.bookings.models import Bookings
from app.hotels.models import Rooms  # ← было Rooms, но модель называется Room
from sqlalchemy import select, insert, func, and_, or_
from app.database import async_session_maker

class BookingDAO(BaseDAO):
    model = Bookings

    @classmethod
    async def add_bookings(cls, user_id: int, room_id: int, date_from: date, date_to: date):
        """
        Проверяет, есть ли свободные места, и создаёт бронь
        """
        async with async_session_maker() as session:
            # Проверяем, есть ли уже забронированные номера на эти даты
            booked_rooms = await session.execute(
                select(func.count())
                .select_from(Bookings)
                .where(
                    and_(
                        Bookings.room_id == room_id,
                        Bookings.date_from <= date_to,
                        Bookings.date_to >= date_from,
                    )
                )
            )
            booked_count = booked_rooms.scalar()

            # Получаем общее количество номеров
            room = await session.get(Rooms, room_id)
            if not room:
                return None

            # Проверяем доступность
            if booked_count >= room.quantity:
                return None  # Нет свободных номеров

            # Получаем цену
            price = room.price

            # Создаём бронь
            new_booking = insert(Bookings).values(
                room_id=room_id,
                user_id=user_id,
                date_from=date_from,
                date_to=date_to,
                price=price,
            ).returning(Bookings)

            result = await session.execute(new_booking)
            await session.commit()

            return result.scalar()  # ✅ возвращаем объект брони