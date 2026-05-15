import os
import json
import logging
from app.json_db import read_json
from twilio.rest import Client
import pandas as pd
from dotenv import load_dotenv

# Force load environment variables from .env
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), '.env'))

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("SMSAlerts")

CITIZENS_FILE = r"C:\Users\Lenovo\Desktop\HACKTHON\EPISENCE\backend\data\citizens.json"
ALERTS_HISTORY_FILE = r"C:\Users\Lenovo\Desktop\HACKTHON\EPISENCE\backend\data\sms_history.json"

class NotificationService:
    def __init__(self):
        # Twilio Configuration from Environment
        self.account_sid = os.getenv("TWILIO_ACCOUNT_SID")
        self.auth_token = os.getenv("TWILIO_AUTH_TOKEN")
        self.messaging_service_sid = os.getenv("TWILIO_MESSAGING_SERVICE_SID")
        self.from_number = os.getenv("TWILIO_SMS_NUMBER")
        
        self.client = None
        if self.account_sid and self.auth_token:
            self.client = Client(self.account_sid, self.auth_token)
            logger.info(f"Twilio SMS Client Initialized for Account: {self.account_sid}")

    def broadcast_ward_alert(self, zone_id, zone_name, risk_level, insight):
        """Sends ACTUAL SMS alerts to citizens in a specific ward."""
        # Force sending for manual tests or high/critical risk
        if risk_level not in ["HIGH", "CRITICAL"] and "TEST" not in zone_name:
            return []

        citizens = read_json(CITIZENS_FILE)
        
        # ROOT FIX: Use case-insensitive and stripped matching for the Zone ID
        target_zone = str(zone_id).strip().upper()
        ward_citizens = [
            c for c in citizens 
            if str(c.get("zone_id", "")).strip().upper() == target_zone
        ]
        
        logger.info(f"Found {len(ward_citizens)} citizens for zone {target_zone}")
        
        broadcast_results = []
        message = (
            f"[EPISENCE ALERT] RED ZONE WARNING: Vector disease risk detected in ward *{zone_name}*!\n"
            f"* Use mosquito repellent\n"
            f"* Remove stagnant water near your home\n"
            f"* Wear full sleeves outdoors\n"
            f"* See a doctor immediately if you have fever\n"
            f"Stay Safe! -EPISENCE AI Command Center"
        )

        for citizen in ward_citizens:
            status = "SIMULATED"
            sid = "MOCK_SID"

            # REAL SENDING LOGIC
            if self.client and citizen.get("phone"):
                try:
                    raw_phone = str(citizen.get('phone', ''))
                    to_number = "".join(filter(lambda x: x.isdigit() or x == '+', raw_phone))
                    
                    logger.info(f"Attempting SMS to: {to_number}")
                    
                    send_params = {
                        "body": message,
                        "to": to_number,
                        "from_": self.from_number
                    }
                    sent_msg = self.client.messages.create(**send_params)
                    status = "SENT"
                    sid = sent_msg.sid
                    logger.info(f"SMS Sent to {citizen['name']} (SID: {sid})")
                except Exception as e:
                    err_str = str(e)
                    if "63038" in err_str or "429" in err_str:
                        status = "LIMIT_REACHED"
                        logger.error("TWILIO DAILY LIMIT (50 msgs) REACHED. Resets at midnight UTC.")
                    elif "21608" in err_str:
                        status = "UNVERIFIED_NUMBER"
                        logger.error(f"Number {to_number} not verified on Twilio Trial account.")
                    else:
                        status = "FAILED"
                        logger.error(f"TWILIO ERROR for {citizen['name']}: {err_str}")

            alert_entry = {
                "citizen_name": citizen["name"],
                "phone": citizen["phone"],
                "status": status,
                "sid": sid,
                "message": message,
                "timestamp": pd.Timestamp.now().isoformat()
            }
            broadcast_results.append(alert_entry)

        # Update History - ROBUST VERSION
        try:
            current_history = []
            if os.path.exists(ALERTS_HISTORY_FILE):
                try:
                    with open(ALERTS_HISTORY_FILE, 'r') as f:
                        content = f.read().strip()
                        if content:
                            current_history = json.loads(content)
                except Exception as e:
                    logger.error(f"Error reading history file: {e}")
            
            current_history.extend(broadcast_results)
            
            # Write with absolute guarantee
            with open(ALERTS_HISTORY_FILE, 'w') as f:
                json.dump(current_history[-100:], f, indent=2)
                f.flush()
                os.fsync(f.fileno())
            
            logger.info(f"Successfully recorded {len(broadcast_results)} alerts to {ALERTS_HISTORY_FILE}")
        except Exception as e:
            logger.error(f"CRITICAL ERROR writing WhatsApp history: {e}")

        return broadcast_results

    def send_hospital_alert(self, hospital_name, contact, message):
        """Sends a targeted SMS to a specific hospital contact."""
        status = "SIMULATED"
        sid = "MOCK_SID"
        
        if self.client and contact:
            try:
                raw_phone = str(contact)
                to_number = "".join(filter(lambda x: x.isdigit() or x == '+', raw_phone))
                
                send_params = {
                    "body": f"🚨 EMERGENCY CAPACITY ALERT [{hospital_name}]: {message}",
                    "to": to_number
                }
                
                if self.messaging_service_sid and self.messaging_service_sid.startswith("MG"):
                    send_params["messaging_service_sid"] = self.messaging_service_sid
                else:
                    send_params["from_"] = self.from_number

                sent_msg = self.client.messages.create(**send_params)
                status = "SENT"
                sid = sent_msg.sid
            except Exception as e:
                status = "FAILED"
                logger.error(f"Hospital Alert Error: {str(e)}")

        # Log it
        alert_entry = {
            "target": hospital_name,
            "phone": contact,
            "status": status,
            "sid": sid,
            "timestamp": pd.Timestamp.now().isoformat()
        }
        return alert_entry

notification_service = NotificationService()
