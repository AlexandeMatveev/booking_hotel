


from sqladmin import ModelView

from app.bookings.models import Bookings
from app.hotels.models import Rooms,Hotel
from app.users.models import Users




class UsersAdmin(ModelView, model=Users):
    column_list = [Users.id, Users.email]
    column_details_exclude_list = [Users.hashed_password]
    can_delete = False
    name = "Пользователь"
    name_plural = "Пользователи"
    icon = "fa-solid fa-user"


class HotelsAdmin(ModelView,model =Hotel):
    column_list = [c.name for c in Hotel.__table__.columns] + [Hotel.rooms]
    name = "Отель"
    name_plural = "Отели"
    icon = "fa-solid fa-hotel"




class RoomsAdmin(ModelView,model =Rooms):
    column_list = [c.name for c in Rooms.__table__.columns] + [Rooms.hotel,Rooms.booking]
    name = "Номер"
    name_plural = "Номера"
    icon = "fa-solid fa-bed"




class BookingsAdmin(ModelView, model=Bookings):
    column_list = [c.name for c in Bookings.__table__.columns] + [Bookings.user]
    
    name = "Бронь"
    name_plural = "Брони"
    