#!/usr/bin/python3
# File: main.py
# Author: Oluwatobiloba Light
"""ALXOverflow Engine room 🚀"""
from fastapi import FastAPI
from fastapi.middleware.gzip import GZipMiddleware
from src.db import db
from os import environ
import uvicorn



def init_app():
    """Initialize app"""
    app = FastAPI(title="ALXOverflow | Where Questions Find Answers 🚀",
                  description="ALX Overflow is a specialized online platform\
                  designed to cater to the unique needs of students enrolled\
                      in the ALX Software Engineering Program.",
                  version="1.0.0")
    app.add_middleware(GZipMiddleware, minimum_size=1000)

    @app.on_event("startup")
    async def startup():
        try:
            await db.connect()
            print("Database Connected!")
        except:
            print("An error has occured")

    @app.on_event("shutdown")
    async def shutdown():
        await db.disconnect()

    @app.get('/')
    def health_check():
        return {"status": "OK"}

    from src.api import api
    app.include_router(api)
    return app


app = init_app()


if __name__ == "__main__":
    port = environ.get("DB_PORT")
    host = environ.get("DB_HOST")
    if port is None:
        port = 8000
    if host is None:
        host = 'localhost'
    uvicorn.run("src.main:app", host=host, port=int(port), reload=True)
