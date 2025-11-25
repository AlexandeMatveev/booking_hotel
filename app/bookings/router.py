

from fastapi import APIRouter

from app.bookings.dao import BookingDAO

from app.bookings.schemas import SBOoking
router = APIRouter(


    prefix="/bookings",
    tags=["Бронирование"],
)






@router.get("")
async def get_booking() -> list[SBOoking]:
        

        result = BookingDAO.find_all()

        return await result

