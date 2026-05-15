from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from datetime import datetime
from app.json_db import read_json, write_json
import os

router = APIRouter()

HOSPITAL_DATA_FILE = os.path.join("backend", "data", "hospital_cases.json")

class CaseSubmission(BaseModel):
    zone_id: str
    disease_type: str
    case_count: int
    severity_level: str = "MODERATE"

@router.post("/submit")
def submit_hospital_data(submission: CaseSubmission):
    data = read_json(HOSPITAL_DATA_FILE)
    
    # Create new entry
    new_entry = {
        "zone_id": submission.zone_id,
        "disease_type": submission.disease_type,
        "case_count": submission.case_count,
        "date": datetime.now().strftime("%Y-%m-%d"),
        "timestamp": datetime.now().isoformat(),
        "severity": submission.severity_level,
        "source": "Institutional Portal"
    }
    
    # In a real app, we'd append or update. For this demo, we'll append to history.
    data.append(new_entry)
    write_json(HOSPITAL_DATA_FILE, data)
    
    return {"status": "success", "message": f"Data recorded for {submission.zone_id}", "entry": new_entry}

from app.services.hospital_service import HospitalService

@router.get("/resources")
def get_all_hospitals():
    return read_json(r"C:\Users\Lenovo\Desktop\HACKTHON\EPISENCE\backend\data\hospitals.json")

@router.get("/mapping")
def get_resource_mapping():
    return HospitalService.get_resource_mapping()

@router.get("/history")
def get_submission_history():
    data = read_json(HOSPITAL_DATA_FILE)
    # Return last 50 entries
    return data[-50:] if len(data) > 50 else data
