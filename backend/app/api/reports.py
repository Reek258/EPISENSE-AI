from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from pydantic import BaseModel
import uuid
from datetime import datetime, timezone
from app.json_db import read_json, write_json
import os

router = APIRouter()

# Use Absolute Path for reliability on Windows
DATA_FILE = r"C:\Users\Lenovo\Desktop\HACKTHON\EPISENCE\backend\data\water_reports.json"

class WaterReport(BaseModel):
    id: Optional[str] = None
    zone_id: str
    latitude: float
    longitude: float
    severity: str # Low, Medium, High
    description: Optional[str] = ""
    status: str = "pending"
    reported_at: Optional[str] = None
    reporter_name: str
    contact_number: Optional[str] = "N/A"
    image_url: Optional[str] = None

@router.get("/", response_model=List[WaterReport])
async def get_reports():
    return read_json(DATA_FILE)

from app.core.websocket import manager

@router.post("/", response_model=WaterReport)
async def create_report(report: WaterReport):
    reports = read_json(DATA_FILE)
    
    new_report = report.dict()
    new_report["id"] = str(uuid.uuid4())
    new_report["reported_at"] = datetime.now(timezone.utc).isoformat()
    
    reports.append(new_report)
    write_json(DATA_FILE, reports)
    
    # Broadcast via WebSocket
    await manager.broadcast({
        "type": "NEW_REPORT",
        "data": new_report
    })
    
    return new_report
@router.delete("/{report_id}")
async def delete_report(report_id: str):
    reports = read_json(DATA_FILE)
    new_reports = [r for r in reports if r.get("id") != report_id]
    
    if len(new_reports) == len(reports):
        raise HTTPException(status_code=404, detail="Report not found")
        
    write_json(DATA_FILE, new_reports)
    return {"message": "Report resolved and removed"}
