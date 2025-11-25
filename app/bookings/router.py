

from app.bookings.dao import BookingDAO
from app.users.models import Users
from fastapi import APIRouter,Request,Depends
from app.users.dependencies import get_current_user

from app.bookings.schemas import SBOoking
router = APIRouter(


    prefix="/bookings",
    tags=["Бронирование"],
)






@router.get("")
async def get_booking(user:Users =Depends(get_current_user)): #-> list[SBOoking]:
    return await BookingDAO.find_all(user_id = user.id)

