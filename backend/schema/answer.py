from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel
from datetime import datetime


class Answers(BaseModel):
    """"""
    id: str
    content:str
    question_id: str
    author_id: str
    created_at: datetime
    updated_at: datetime
    
class CreateAnswer(BaseModel):
    """"""
    content: str
    question_id: str
    author_id: str

    def to_json(self) -> dict:
        """
        Convert Answer model to JSON
        """
        new_dict = jsonable_encoder(self)
        return new_dict
    
class ReplyAnswer(BaseModel):
    """"""
    content: str
    question_id: str
    answer_id: str
    author_id: str
    
    def to_json(self) -> dict:
        """
        Convert Answer model to JSON
        """
        new_dict = jsonable_encoder(self)
        return new_dict
