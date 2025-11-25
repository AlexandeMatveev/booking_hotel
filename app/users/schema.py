

from pydantic import BaseModel,EmailStr


class SUserRegister(BaseModel):
    email: EmailStr
    password: str


    class Config:
      from_attributes = True