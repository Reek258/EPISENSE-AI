import httpx
import logging
from app.config import settings
from typing import Dict, Any

logger = logging.getLogger(__name__)

async def fetch_real_weather(location: str = "Pune") -> Dict[str, Any]:
    """
    Fetch real-time weather data from AccuWeather API.
    Pune Location Key: 204848
    """
    api_key = settings.ACCUWEATHER_API_KEY
    location_key = "204848" # Pune, India

    if not api_key or api_key == "YOUR_ACCUWEATHER_KEY_HERE":
        logger.warning("ACCUWEATHER_API_KEY is not set. Returning fallback data.")
        return {
            "temp": 28.5,
            "humidity": 62,
            "rainfall": 0.0,
            "condition": "Clear (Accu-Baseline)",
            "is_real": False
        }

    # AccuWeather Current Conditions API (Using HTTPS)
    url = f"https://dataservice.accuweather.com/currentconditions/v1/{location_key}"
    params = {
        "apikey": api_key,
        "details": "true"
    }

    try:
        async with httpx.AsyncClient(follow_redirects=True) as client:
            response = await client.get(url, params=params, timeout=10.0)
            
            if response.status_code == 401:
                return {
                    "temp": 28.5,
                    "humidity": 62,
                    "rainfall": 0.0,
                    "condition": "Key Not Authorized",
                    "is_real": False
                }
            elif response.status_code == 503:
                return {
                    "temp": 28.5,
                    "humidity": 62,
                    "rainfall": 0.0,
                    "condition": "Limit Exceeded",
                    "is_real": False
                }
                
            response.raise_for_status()
            data = response.json()
            
            if not data:
                raise Exception("No data received from AccuWeather")
                
            current = data[0]
            
            return {
                "temp": current.get("Temperature", {}).get("Metric", {}).get("Value", 28.5),
                "humidity": current.get("RelativeHumidity", 62.0),
                "rainfall": current.get("PrecipitationSummary", {}).get("Precipitation", {}).get("Metric", {}).get("Value", 0.0),
                "condition": current.get("WeatherText", "Clear"),
                "is_real": True
            }
    except Exception as e:
        logger.error(f"Error fetching weather from AccuWeather: {e}")
        return {
            "temp": 28.5,
            "humidity": 62,
            "rainfall": 0.0,
            "condition": "Accu-Offline",
            "is_real": False
        }
