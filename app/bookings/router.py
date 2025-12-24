

from datetime import date
from fastapi import HTTPException
from pydantic import parse_obj_as
from app.bookings.dao import BookingDAO
from app.hotels.models import Rooms
from app.tasks.tasks import send_booking_email
from app.users.models import Users
from fastapi import APIRouter,Request,Depends
from app.users.dependencies import get_current_user

from exceptions import RoomCannotBookedException

from app.database import async_session_maker
from app.bookings.models import Bookings

from sqlalchemy import select
from app.bookings.schemas import SBOoking
router = APIRouter(


    prefix="/bookings",
    tags=["Бронирование"],
)






@router.get("g")
async def get_booking(user:Users =Depends(get_current_user)) -> list[SBOoking]:
    return await BookingDAO.find_all(user_id = user.id)



@router.post("", response_model=SBOoking)
async def create_booking(
    room_id: int,
    date_from: date,
    date_to: date,
    user=Depends(get_current_user)
):
    # Проверка: дата заезда раньше выезда
    if date_from >= date_to:
        raise HTTPException(status_code=400, detail="Дата заезда должна быть раньше даты выезда")

    async with async_session_maker() as session:
        # Проверяем, свободен ли номер на указанные даты
        result = await session.execute(
            select(Bookings).where(
                Bookings.room_id == room_id,
                Bookings.date_from <= date_to,
                Bookings.date_to >= date_from
            )
        )
        if result.scalar():
            raise HTTPException(status_code=409, detail="Номер уже забронирован на эти даты")

        # Получаем номер по ID
        room = await session.get(Rooms, room_id)
        if not room:
            raise HTTPException(status_code=404, detail="Номер не найден")

        # Рассчитываем стоимость
        total_days = (date_to - date_from).days
        total_cost = total_days * room.price

        # Создаём бронь
        booking = await BookingDAO.add(
            user_id=user.id,
            room_id=room_id,
            date_from=date_from,
            date_to=date_to,
            price=room.price,
            #total_cost=total_cost
        )
        send_booking_email.delay(booking,user.email)

        return booking
    
@router.post("r")
async def add_booking(
        room_id: int, date_from: date, date_to: date,
        user: Users = Depends(get_current_user),
    ):
        booking = await BookingDAO.add_bookings(user.id, room_id, date_from, date_to)
        booking_dict = parse_obj_as(SBOoking, booking).dict()
        send_booking_email.delay(booking_dict, user.email)
        return booking_dict