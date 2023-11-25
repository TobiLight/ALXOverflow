from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel, EmailStr, Field
from datetime import datetime


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
