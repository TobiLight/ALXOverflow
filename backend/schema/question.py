from typing import Union
from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel, EmailStr, Field
from datetime import datetime

from schema.user import UserDetails


class CreateQuestion(BaseModel):
    title: str = Field(default=None)
    content: str = Field(default=None)
    # author_id: str = Field(default=None)
    # created_at: datetime = Field(default=datetime.now())
    # updated_at: datetime = Field(default=datetime.now())

    def to_json(self) -> dict:
        """
        Convert User model to JSON
        """
        new_dict = jsonable_encoder(self)
        return new_dict


class Question(BaseModel):
    """"""
    id: str
    title: str
    content: str
    created_at: datetime
    updated_at: datetime
    answers: list
    author_id: str
    author: Union[UserDetails, None] = None
    
    def to_json(self) -> dict:
        """
        Convert User model to JSON
        """
        new_dict = jsonable_encoder(self)
        return new_dict


class FetchQuestions(BaseModel):
    """"""
    per_page: Union[int, None] = None
    page: Union[int, None] = None
    most_asked: Union[bool, None] = None
