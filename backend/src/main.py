#!/usr/bin/python3
# File: main.py
# Author: Oluwatobiloba Light
"""ALXOverflow Engine room 🚀"""
from fastapi import FastAPI
from fastapi.middleware.gzip import GZipMiddleware
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

    @app.get('/')
    def home():
        return "welcome home!"

    from src.api import api
    app.include_router(api)
    return app


app = init_app()


if __name__ == "__main__":
    port = environ.get("alxo_port")
    host = environ.get("alxo_host")
    if port is None:
        port = 8000
    if host is None:
        host = 'localhost'
    uvicorn.run("src.main:app", host=host, port=port, reload=True)
