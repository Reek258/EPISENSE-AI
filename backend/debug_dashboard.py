import sys
import os
import asyncio

# Add the app directory to sys.path
sys.path.append(os.path.join(os.getcwd(), "app"))

from app.services.dashboard_service import get_dashboard_summary
import json

async def test():
    try:
        summary = await get_dashboard_summary()
        print(json.dumps(summary, indent=4))
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test())
