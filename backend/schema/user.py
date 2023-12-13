import datetime
from enum import Enum
from typing import Union
from typing_extensions import Annotated
from uuid import UUID
from pydantic import BaseModel, EmailStr, Field
from prisma.bases import BaseUser
from fastapi.encoders import jsonable_encoder


class UserWithName(BaseUser):
    name: str


class Role(str, Enum):
    STUDENT = "STUDENT"
    MENTOR = "MENTOR"


class UserSignIn(BaseModel):
    email: EmailStr
    password: str


class UserSignUp(BaseModel):
    email: EmailStr = Field(...)
    first_name: Union[str, None] = None
    last_name: Union[str, None] = None
    username: str = Field(...)
    password: str = Field(...)
    cpassword: str = Field(...)

    def to_json(self):
        user_dict = jsonable_encoder(self)
        del user_dict["cpassword"]
        return user_dict


class UserProfile(BaseModel):
    id: UUID = Field(...)
    email: EmailStr = Field(...)
    first_name: Union[str, None] = Field(default=None)
    last_name: Union[str, None] = Field(default=None)
    username: str = Field(...)
    bio: Union[str, None] = Field(default=None)
    profile_picture: Union[str, None] = Field(default=None)
    reputation_score: Union[int, None] = Field(default=None)
    role: Annotated[Role, "STUDENT"] = Field(default=Role.STUDENT)
    created_at: datetime.datetime = Field(default=datetime.datetime.now())
    updated_at: datetime.datetime = Field(default=datetime.datetime.now())


class UserDetails(BaseUser):
    id: str
    email: EmailStr
    first_name: Union[str, None] = None
    last_name: Union[str, None] = None
    username: Union[str, None] = None
    bio: Union[str, None]
    profile_picture: Union[str, None]
    reputation_score: Union[int, None]
    role: Annotated[Role, "STUDENT"]
    created_at: datetime.datetime
    updated_at: datetime.datetime

    def to_json(self):
        """
        Convert User model to JSON
        """
        user_dict = jsonable_encoder(self)
        return user_dict

class UpdateUser(BaseModel):
    first_name: Union[str, None] = None
    last_name: Union[str, None] = None
    bio: Union[str, None]
    # profile_picture: Union[str, None] = None

class UserSignInOutput(BaseModel):
    token: str
    user: Union[UserProfile, None] = Field(default=None)


class UserSignUpOutput(BaseModel):
    message: str
    user: Union[UserProfile, None]
