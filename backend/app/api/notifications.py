from fastapi import APIRouter
from pydantic import BaseModel
from app.services.notification_service import ALERTS_HISTORY_FILE, notification_service
from app.json_db import read_json
import os

router = APIRouter()

class HospitalAlertRequest(BaseModel):
    hospital_name: str
    contact: str
    message: str

@router.get("/history")
def get_alert_history():
    if not os.path.exists(ALERTS_HISTORY_FILE):
        return []
    return read_json(ALERTS_HISTORY_FILE)

@router.post("/hospital-alert")
def send_hospital_alert(req: HospitalAlertRequest):
    result = notification_service.send_hospital_alert(
        hospital_name=req.hospital_name,
        contact=req.contact,
        message=req.message
    )
    return {"status": "ok", "result": result}

@router.get("/test")
def send_test_alert():
    return notification_service.broadcast_ward_alert(
        zone_id="d867ca9c-93f0-410e-95d5-8717a6741797",
        zone_name="Kothrud - Bawdhan (TEST)",
        risk_level="CRITICAL",
        insight="This is a manual system verification test."
    )
