import json
import os
import uuid
from datetime import datetime, timezone

def simulate_outbreak(zone_name="Kothrud"):
    root_dir = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
    data_dir = os.path.join(root_dir, "backend", "data")
    ALERTS_FILE = os.path.join(data_dir, "alerts.json")
    
    # 1. Find the Zone ID (using case-insensitive partial match)
    with open(os.path.join(data_dir, "zones.json"), 'r') as f:
        zones = json.load(f)
    
    def normalize(s):
        return s.lower().replace(" ", "").replace("-", "")

    target_zone = next((z for z in zones if normalize(zone_name) in normalize(z['name'])), None)
    if not target_zone:
        print(f"Zone {zone_name} not found.")
        return
    
    zone_id = target_zone['id']
    now_iso = datetime.now(timezone.utc).isoformat()
    
    print(f"[!] Simulating outbreak in {zone_name} ({zone_id})...")

    # 2. Inject Critical Weather (Heavy Rain + High Humidity)
    with open(os.path.join(data_dir, "weather_data.json"), 'r') as f:
        weather = json.load(f)
    
    new_weather = {
        "id": str(uuid.uuid4()),
        "zone_id": zone_id,
        "date": now_iso,
        "temperature_avg": 29.5,
        "humidity_avg": 85.0,
        "rainfall_mm": 120.5, # Heavy monsoon rain
        "wind_speed": 15.0,
        "fetched_at": now_iso
    }
    weather.append(new_weather)
    with open(os.path.join(data_dir, "weather_data.json"), 'w') as f:
        json.dump(weather, f, indent=4)

    # 3. Inject Massive Hospital Cases
    with open(os.path.join(data_dir, "hospital_cases.json"), 'r') as f:
        cases = json.load(f)
    
    # Add 45 new cases at once
    for _ in range(45):
        cases.append({
            "id": str(uuid.uuid4()),
            "zone_id": zone_id,
            "date": now_iso,
            "disease_type": "Dengue",
            "case_count": 1,
            "hospital_name": "Emergency Demo Center"
        })
    with open(os.path.join(data_dir, "hospital_cases.json"), 'w') as f:
        json.dump(cases, f, indent=4)

    # 4. Manually Update Risk Score to CRITICAL
    with open(os.path.join(data_dir, "risk_scores.json"), 'r') as f:
        scores = json.load(f)
    
    new_score = {
        "id": str(uuid.uuid4()),
        "zone_id": zone_id,
        "date": now_iso,
        "composite_score": 98.5, # Very high risk
        "risk_level": "CRITICAL",
        "ml_prediction": {"forecast_7d": 99.2}
    }
    scores.append(new_score)
    with open(os.path.join(data_dir, "risk_scores.json"), 'w') as f:
        json.dump(scores, f, indent=4)

    # 5. Inject an Alert into alerts.json
    with open(ALERTS_FILE, 'r') as f:
        alerts = json.load(f)
    
    new_alert = {
        "id": str(uuid.uuid4()),
        "zone_id": zone_id,
        "date": now_iso,
        "title": f"Outbreak Alert: {zone_name}",
        "description": f"Abnormal increase in cases detected in {zone_name}. Immediate intervention required.",
        "severity": "CRITICAL",
        "is_active": True
    }
    alerts.append(new_alert)
    with open(ALERTS_FILE, 'w') as f:
        json.dump(alerts, f, indent=4)

    print(f"DONE: Outbreak simulation complete. {zone_name} is now in CRITICAL state with an active alert.")
    print("Refresh your dashboard to see the red indicator.")

if __name__ == "__main__":
    simulate_outbreak("Kothrud-Bawdhan")
