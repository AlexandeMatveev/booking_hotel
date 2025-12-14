
from datetime import datetime
from app.users.dao import UsersDAO
from fastapi import Request,HTTPException,Depends
from jose import jwt,JWTError

from exceptions import TokenExpiredException,TokenAbsentException,IncorrectFormTokenException,UserIsNotPresentException


from app.config import settings

def get_token(request:Request):

    token = request.cookies.get("booking_access_token")
    if not token:
        raise TokenAbsentException
    return token



async def get_current_user(token:str = Depends(get_token)):
    try:
        payload=jwt.decode(token,settings.SECRET_KEY,settings.ALGORITHM)
    except JWTError:
        raise IncorrectFormTokenException
    expire: str = payload.get("exp")
    if (not expire) or (int(expire)<datetime.utcnow().timestamp()):
        raise TokenExpiredException
    user_id:str = payload.get("sub")
    if not user_id:
        raise UserIsNotPresentException

    user = await UsersDAO.find_by_id(int(user_id))
    if not user:
        raise UserIsNotPresentException
    
    return user




