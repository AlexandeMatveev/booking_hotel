

from fastapi import HTTPException,status


UserAlreadyExistsException = HTTPException(
    status_code = status.HTTP_409_CONFLICT,
    detail = "Пользователь  уже существует"
)


IncorrectEmailException = HTTPException(
    status_code = status.HTTP_401_UNAUTHORIZED,
    detail = "Неверный email или пароль"
)



TokenExpiredException = HTTPException(
        status_code = status.HTTP_401_UNAUTHORIZED,
        detail = "Токен истек"
)


TokenAbsentException = HTTPException(
        status_code = status.HTTP_401_UNAUTHORIZED,
        detail = "Токен отсутствует"
)

IncorrectFormTokenException = HTTPException(
        status_code = status.HTTP_401_UNAUTHORIZED,
        detail = "Неверный токен"
)


UserIsNotPresentException = HTTPException(
        status_code = status.HTTP_401_UNAUTHORIZED,
        detail = "Пользователь не найден"
)
