from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ZoneBase(BaseModel):
    name: str
    latitude: float
    longitude: float
    radius_km: float
    city: str
    state: str

class ZoneCreate(ZoneBase):
    pass

class ZoneResponse(ZoneBase):
    id: str
    risk_level: Optional[str] = None
    composite_score: Optional[float] = None

    class Config:
        orm_mode = True
