

from fastapi import APIRouter,Request

from app.bookings.dao import BookingDAO

from app.bookings.schemas import SBOoking
router = APIRouter(


    prefix="/bookings",
    tags=["Бронирование"],
)






@router.get("")
async def get_booking(request:Request): #-> list[SBOoking]:

    


        

    result = BookingDAO.find_all()

       # return await result

