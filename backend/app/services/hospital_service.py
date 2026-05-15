import os
from app.json_db import read_json
from app.services.prediction_service import prediction_service

HOSPITALS_FILE = r"C:\Users\Lenovo\Desktop\HACKTHON\EPISENCE\backend\data\hospitals.json"

class HospitalService:
    def get_resource_mapping():
        hospitals = read_json(HOSPITALS_FILE)
        predictions = prediction_service.get_all_predictions()
        
        mapping_results = []
        
        for hospital in hospitals:
            zone_id = hospital.get("zone_id")
            # Get predicted cases for this hospital's zone
            zone_pred = predictions.get(zone_id, {})
            predicted_cases = int(zone_pred.get("predicted_risk_score_7d", 0) / 2) # Rough estimate for cases
            
            resources = hospital.get("resources", {})
            available_beds = resources.get("available_beds", 0)
            
            # 1. Bed Sufficiency Analysis
            bed_status = "SUFFICIENT"
            if predicted_cases > available_beds:
                bed_status = "CRITICAL"
            elif predicted_cases > (available_beds * 0.7):
                bed_status = "MODERATE_RISK"
                
            # 2. Medicine/Vaccine Analysis
            med_status = "STOCKED"
            if resources.get("dengue_kits", 0) < (predicted_cases * 10):
                med_status = "REPLENISH_SOON"
                
            mapping_results.append({
                "hospital_id": hospital.get("id"),
                "name": hospital.get("name"),
                "zone_id": zone_id,
                "predicted_7d_load": predicted_cases,
                "current_capacity": {
                    "beds": available_beds,
                    "meds": resources.get("dengue_kits"),
                    "vaccines": resources.get("vaccine_doses")
                },
                "status": {
                    "beds": bed_status,
                    "supplies": med_status
                },
                "recommendation": "INCREASE_BEDS" if bed_status == "CRITICAL" else "MAINTAIN"
            })
            
        return mapping_results

hospital_service = HospitalService()
