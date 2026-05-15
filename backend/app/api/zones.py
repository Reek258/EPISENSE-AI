from fastapi import APIRouter, HTTPException, status
from typing import List
from app.schemas.zone import ZoneResponse
from app.services.zone_service import get_all_zones, get_zone_by_id

router = APIRouter()

@router.get("", response_model=List[ZoneResponse])
def read_zones():
    return get_all_zones()

@router.get("/{zone_id}", response_model=ZoneResponse)
def read_zone(zone_id: str):
    zone = get_zone_by_id(zone_id)
    if not zone:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Zone not found"
        )
    return zone
