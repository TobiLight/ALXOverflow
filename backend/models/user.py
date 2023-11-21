import datetime
from enum import Enum
from typing import Union
from typing_extensions import Annotated
from pydantic import BaseModel, EmailStr, Field
from prisma.models import User
from prisma.bases import BaseUser


class Role(str, Enum):
    STUDENT = "STUDENT"
    MENTOR = "MENTOR"


class UserSignIn(BaseModel):
    email: EmailStr
    password: str


class UserSignUp(BaseModel):
    email: EmailStr = Field(...)
    password: str = Field(...)
    cpassword: str = Field(...)


class UserProfile(BaseModel):
    id: str = Field(...)
    email: EmailStr = Field(...)
    first_name: Union[str, None] = Field(default=None)
    last_name: Union[str, None] = Field(default=None)
    username: str
    bio: Union[str, None] = Field(default=None)
    profile_picture: Union[str, None] = Field(default=None)
    reputation_score: Union[int, None] = Field(default=None)
    role: Annotated[Role, "STUDENT"] = Field(default=Role.STUDENT)
    created_at: datetime.datetime = Field(default=datetime.datetime.now())
    updated_at: datetime.datetime = Field(default=datetime.datetime.now())


class UserSignUpOutput(BaseModel):
    token: str
    user: Union[UserProfile, None]


class Usur(BaseUser):
    """User class using Prisma"""
    id: str
    email: EmailStr
    first_name: str
    last_name: str
    username: str
    bio: Union[str, None]
    profile_picture: Union[str, None]
    reputation_score: Union[int, None]
    role: Annotated[Role, "STUDENT"]
    created_at: datetime.datetime
    updated_at: datetime.datetime


class UserSignInOutput(BaseModel):
    token: str
    user: Union[UserProfile, None] = Field(default=None)


class User_(BaseModel):
    user: User
