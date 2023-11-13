from enum import Enum
from typing import Union
from pydantic import BaseModel, EmailStr
from prisma.models import User


class Role(str, Enum):
    USER = "USER"
    ADMIN = "ADMIN"


class UserSignIn(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    token: str
    user: Union[User, None]
