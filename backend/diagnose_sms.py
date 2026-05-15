"""
Standalone Twilio SMS diagnostic - run with:
  python diagnose_sms.py
"""
import os
from dotenv import load_dotenv

load_dotenv(r"C:\Users\Lenovo\Desktop\HACKTHON\EPISENCE\backend\.env")

account_sid = os.getenv("TWILIO_ACCOUNT_SID")
auth_token  = os.getenv("TWILIO_AUTH_TOKEN")
msg_svc_sid = os.getenv("TWILIO_MESSAGING_SERVICE_SID")
from_number = os.getenv("TWILIO_SMS_NUMBER")

print(f"Account SID : {account_sid}")
print(f"Auth Token  : {auth_token[:6]}***")
print(f"Msg Svc SID : {msg_svc_sid}")
print(f"From Number : {from_number}")
print("-" * 50)

from twilio.rest import Client
from twilio.base.exceptions import TwilioRestException

client = Client(account_sid, auth_token)

TO_NUMBER = "+918010877424"
MESSAGE   = "[EPISENCE TEST] This is a diagnostic test from the EPISENCE AI surveillance platform."

print(f"Attempting to send SMS to: {TO_NUMBER}")
try:
    # Get the new account's phone number directly
    incoming_numbers = client.incoming_phone_numbers.list(limit=1)
    if incoming_numbers:
        from_num = incoming_numbers[0].phone_number
        print(f"Using phone number from account: {from_num}")
    else:
        from_num = from_number
        print(f"No numbers found on account, using .env value: {from_num}")

    msg = client.messages.create(
        body=MESSAGE,
        to=TO_NUMBER,
        from_=from_num
    )
    print(f"SUCCESS! SID={msg.sid}  Status={msg.status}")
except TwilioRestException as e:
    print(f"\n=== TWILIO ERROR ===")
    print(f"Code    : {e.code}")
    print(f"Status  : {e.status}")
    print(f"Message : {e.msg}")
    print(f"More    : {e.more_info}")
    print(f"\nFIX GUIDE:")
    if e.code == 21608:
        print("  -> The number +919637080703 is NOT verified on your Twilio Trial account.")
        print("  -> Go to: https://console.twilio.com/us1/develop/phone-numbers/verified-caller-ids")
        print("  -> Click 'Add a new Caller ID' and verify the number.")
    elif e.code == 21211:
        print("  -> Invalid 'To' number format. Try without spaces.")
    elif e.code == 20003:
        print("  -> Authentication failed. Check TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN in .env")
    elif e.code == 21704:
        print("  -> Messaging Service SID is not linked to an SMS sender.")
        print("  -> Go to Twilio Console > Messaging > Services and add a phone number to the service.")
    else:
        print(f"  -> See: {e.more_info}")
except Exception as e:
    print(f"UNEXPECTED ERROR: {type(e).__name__}: {e}")
