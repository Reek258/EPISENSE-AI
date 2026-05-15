import os
import uuid
from typing import List, Optional
from app.json_db import read_json, write_json
from app.services.prediction_service import prediction_service

ZONES_FILE = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data", "zones.json")
RISK_SCORES_FILE = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data", "risk_scores.json")

def get_all_zones() -> List[dict]:
    zones = read_json(ZONES_FILE)
    risk_scores = read_json(RISK_SCORES_FILE)
    
    # Get latest risk score per zone
    latest_scores = {}
    for rs in risk_scores:
        zid = rs.get("zone_id")
        if zid not in latest_scores or rs.get("date") > latest_scores[zid].get("date", ""):
            latest_scores[zid] = rs
            
    # Get live ML predictions to ensure dashboard shows "future" indicators automatically
    ml_predictions = prediction_service.get_all_predictions()
            
    # Merge ML prediction data into zones
    for zone in zones:
        zid = zone.get("id")
        if zid in ml_predictions:
            # Overwrite static data with ML-Predicted risk
            zone["risk_level"] = ml_predictions[zid].get("risk_level", "LOW")
            zone["composite_score"] = ml_predictions[zid].get("predicted_risk_score_7d", 0)
            zone["ml_insight"] = ml_predictions[zid].get("insight", "Stable.")
        elif zid in latest_scores:
            zone["risk_level"] = latest_scores[zid].get("risk_level", "LOW")
            zone["composite_score"] = latest_scores[zid].get("composite_score", 0)
        else:
            zone["risk_level"] = "LOW"
            zone["composite_score"] = 0
            
    return zones

def get_zone_by_id(zone_id: str) -> Optional[dict]:
    zones = get_all_zones()
    for zone in zones:
        if zone.get("id") == zone_id:
            return zone
    return None

def create_zone(zone_data: dict) -> dict:
    zones = get_all_zones()
    new_zone = {
        "id": str(uuid.uuid4()),
        **zone_data
    }
    zones.append(new_zone)
    write_json(ZONES_FILE, zones)
    return new_zone
