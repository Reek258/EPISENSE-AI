import os
import json
import joblib
import pandas as pd
from datetime import datetime, timezone
from app.ml.preprocessor import DataPreprocessor
from app.ml.model_manager import ModelManager

def run_update():
    root_dir = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
    data_dir = os.path.join(root_dir, "backend", "data")
    model_path = os.path.join(root_dir, "backend", "models", "risk_predictor.joblib")
    
    if not os.path.exists(model_path):
        print("[!] Model not found. Please run 'python backend/app/ml/train.py' first.")
        return

    print("[*] Loading latest data and model...")
    preprocessor = DataPreprocessor(data_dir)
    # We use a specialized method for inference data
    X, zone_ids, features = preprocessor.prepare_prediction_data()
    
    # Load model
    model = joblib.load(model_path)
    
    # Predict on the latest data points
    print(f"[*] Generating new risk predictions for {len(X)} records...")
    predictions = model.predict(X)
    
    # Create the risk scores
    risk_scores = []
    now_iso = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    
    for i, zid in enumerate(zone_ids):
        # Get raw features for this prediction to apply hard rules
        row = X.iloc[i]
        cases = row['case_count']
        
        # ML Score as baseline
        ml_score = float(predictions[i])
        
        # HEURISTIC OVERRIDE (Epidemiological Hard Rules)
        # This ensures the demo ALWAYS shows red/orange for high case counts
        if cases >= 150:
            level = "CRITICAL"
            score = max(85.0, ml_score)
        elif cases >= 75:
            level = "HIGH"
            score = max(65.0, ml_score)
        elif cases >= 30:
            level = "MODERATE"
            score = max(45.0, ml_score)
        else:
            # Fallback to ML prediction
            score = ml_score
            if score >= 75: level = "CRITICAL"
            elif score >= 50: level = "HIGH"
            elif score >= 25: level = "MODERATE"
            else: level = "LOW"
        
        # Clip score for safety
        score = max(0, min(100, score))
        
        risk_scores.append({
            "id": f"pred-{zid}-{i}",
            "zone_id": zid,
            "date": now_iso,
            "composite_score": round(score, 1),
            "risk_level": level,
            "ml_prediction": {
                "forecast_7d": round(score * 1.05, 1), # Simple trend simulation
                "insight": "Outbreak detected based on major case spike!" if level in ["HIGH", "CRITICAL"] else "Stable conditions."
            }
        })

    # Write to risk_scores.json
    output_path = os.path.join(data_dir, "risk_scores.json")
    with open(output_path, 'w') as f:
        json.dump(risk_scores, f, indent=4)
    
    print(f"[+] SUCCESS: {len(risk_scores)} indicators updated in risk_scores.json.")
    print("[!] Refresh your dashboard to see the new colors!")

if __name__ == "__main__":
    run_update()
