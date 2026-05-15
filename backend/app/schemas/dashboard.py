from pydantic import BaseModel
from typing import List, Dict, Any

class DashboardSummaryResponse(BaseModel):
    total_zones: int
    active_alerts: int
    average_risk_score: float
    total_cases_7d: int
    disease_breakdown: Dict[str, int]
    risk_distribution: Dict[str, int]
    total_stagnant_water_reports: int
    current_weather: Dict[str, Any]
    prediction_7d_summary: Dict[str, Any]
