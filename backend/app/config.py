import os
from typing import List
from pydantic import BaseSettings


class Settings(BaseSettings):
    SECRET_KEY: str = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 480
    OPENWEATHERMAP_API_KEY: str = ""
    VISUAL_CROSSING_API_KEY: str = ""
    ACCUWEATHER_API_KEY: str = ""

    # Allow CORS from typical frontend ports
    CORS_ORIGINS: List[str] = [
        "http://localhost",
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
    ]

    class Config:
        env_file = ".env"


settings = Settings()
