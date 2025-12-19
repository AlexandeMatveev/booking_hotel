
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI,Query,Depends
from typing import Optional 
from datetime import date
from pydantic import BaseModel

from app.bookings.router import router as router_bookings
from app.users.router import router as router_users



app = FastAPI()

app.include_router(router_users)
app.include_router(router_bookings)




class HotelSearchArgs:
    def __init__(
        self,
        date_from:date,
        date_to:date,
        location:str,
        has_pa: Optional[bool]=None,
        stars: Optional[int]=Query(None,ge=1,le = 5),
):  
        self.location=location
        self.date_from= date_from
        self.date_to = date_to
        self.has_pa=has_pa
        self.stars = stars



class SHotel(BaseModel):
    address:str
    name:str
    stars:int


@app.get("/hotels")
def get_hotels(
    search_args:HotelSearchArgs=Depends()
):
    return search_args
    






app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # ← Должен быть точный URL фронтенда, НЕ "*"
    allow_credentials=True,                   # ← Разрешаем куки
    allow_methods=["*"],                      # Разрешаем все методы (GET, POST, OPTIONS и т.д.)
    allow_headers=["*"],                      # Разрешаем все заголовки
)