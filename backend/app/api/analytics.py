from fastapi import APIRouter, HTTPException
from app.services.prediction_service import prediction_service

router = APIRouter()

@router.get("/prediction/{zone_id}")
def get_prediction(zone_id: str):
    result = prediction_service.get_zone_prediction(zone_id)
    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])
    return result

@router.get("/predictions/all")
def get_all_predictions():
    # Use live ML model to generate current risk assessments
    return prediction_service.get_all_predictions()
