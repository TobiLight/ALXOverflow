from pydantic import BaseModel


class Settings(BaseModel):
    DB_HOST: str
    DB_USER: str
    DB_PWD: str
    DB_NAME: str
    DB_URL: str
    DB_PORT: int
