

from datetime import date
from app.bookings.dao import BookingDAO
from app.users.models import Users
from fastapi import APIRouter,Request,Depends
from app.users.dependencies import get_current_user

from exceptions import RoomCannotBookedException
from app.bookings.schemas import SBOoking
router = APIRouter(


    prefix="/bookings",
    tags=["Бронирование"],
)






@router.get("")
async def get_booking(user:Users =Depends(get_current_user)) -> list[SBOoking]:
    return await BookingDAO.find_all(user_id = user.id)



@router.post("booking")
async def create_booking(
    room_id:int,date_from:date,date_to:date,
    booking:SBOoking, user:Users =Depends(get_current_user),
                         
):
    booking = await BookingDAO.create(user.id,room_id,date_from,date_to)
    if not booking:
        raise RoomCannotBookedException

