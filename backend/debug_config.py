from app.config import settings
import os

print(f"CWD: {os.getcwd()}")
print(f".env exists: {os.path.exists('.env')}")
print(f"OPENWEATHERMAP_API_KEY from settings: '{settings.OPENWEATHERMAP_API_KEY}'")
if settings.OPENWEATHERMAP_API_KEY:
    print("API KEY IS LOADED!")
else:
    print("API KEY IS MISSING IN SETTINGS!")
