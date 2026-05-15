import os
import pandas as pd
from app.ml.model_manager import ModelManager
from app.ml.preprocessor import DataPreprocessor
from app.services.notification_service import notification_service

class PredictionService:
    def __init__(self):
        root_dir = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
        self.data_dir = os.path.join(root_dir, "data")
        self.model_dir = os.path.join(root_dir, "models")
        self.model_manager = ModelManager(self.model_dir)
        self.preprocessor = DataPreprocessor(self.data_dir)
        
        # Load model on init
        self.model_manager.load_model()

    def get_zone_prediction(self, zone_id: str):
        # Use the preprocessor to get the latest feature state for this zone
        X_pred, zone_ids, _ = self.preprocessor.prepare_prediction_data()
        
        if zone_id not in zone_ids:
            return {"error": f"No data found for zone {zone_id}"}
        
        # Find the index for this zone
        idx = zone_ids.index(zone_id)
        zone_features = X_pred.iloc[[idx]]
        
        # Predict using the loaded model
        prediction = self.model_manager.predict(zone_features)[0]
        
        # Determine risk level and insight
        risk_level = "LOW"
        if prediction > 75: risk_level = "CRITICAL"
        elif prediction > 50: risk_level = "HIGH"
        elif prediction > 25: risk_level = "MODERATE"
        
        insights = {
            "CRITICAL": "Extreme risk! Immediate intervention and public alerts required.",
            "HIGH": "High risk of outbreak. Enhanced surveillance recommended.",
            "MODERATE": "Moderate risk. Continue routine monitoring.",
            "LOW": "Low risk. Conditions are stable."
        }
        
        # Fetch zone name for the response
        zones_df, _, _, _ = self.preprocessor.load_data()
        zone_name = zones_df[zones_df['id'] == zone_id]['name'].iloc[0] if not zones_df[zones_df['id'] == zone_id].empty else zone_id

        return {
            "zone_name": zone_name,
            "zone_id": zone_id,
            "predicted_risk_score_7d": round(float(prediction), 1),
            "risk_level": risk_level,
            "insight": insights[risk_level],
            "timestamp": pd.Timestamp.now().isoformat()
        }

    def get_all_predictions(self):
        # Ensure model is loaded
        if self.model_manager.model is None:
            self.model_manager.load_model()
            
        X_pred, zone_ids, _ = self.preprocessor.prepare_prediction_data()
        predictions = self.model_manager.predict(X_pred)
        
        # Load zone metadata for name mapping
        zones_df, _, _, _ = self.preprocessor.load_data()
        id_to_name = dict(zip(zones_df['id'], zones_df['name']))
        
        results = {}
        for i, zid in enumerate(zone_ids):
            pred = predictions[i]
            risk_level = "LOW"
            if pred > 75: risk_level = "CRITICAL"
            elif pred > 50: risk_level = "HIGH"
            elif pred > 25: risk_level = "MODERATE"
            
            insights = {
                "CRITICAL": "Outbreak imminent. Mobilize emergency health teams.",
                "HIGH": "Climatic conditions highly favorable for disease vectors.",
                "MODERATE": "Monitor mosquito breeding sites closely.",
                "LOW": "Environmental indicators within normal range."
            }
            
            results[zid] = {
                "zone_id": zid,
                "zone_name": id_to_name.get(zid, zid),
                "predicted_risk_score_7d": round(float(pred), 1),
                "risk_level": risk_level,
                "insight": insights[risk_level]
            }
            # NOTE: SMS alerts are ONLY sent manually via the Alert Center button.
            # Auto-sending has been disabled to prevent spam.
        return results

prediction_service = PredictionService()
