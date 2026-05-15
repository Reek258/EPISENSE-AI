from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.api import auth, zones, dashboard, analytics, reports, hospital, notifications
from app.core.websocket import manager
from fastapi import WebSocket, WebSocketDisconnect

app = FastAPI(
    title="EPISENCE API",
    description="Backend for EPISENCE Epidemiological Dashboard",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(zones.router, prefix="/api/v1/zones", tags=["Zones"])
app.include_router(reports.router, prefix="/api/v1/reports", tags=["Reports"])
app.include_router(dashboard.router, prefix="/api/v1/dashboard", tags=["Dashboard"])
app.include_router(analytics.router, prefix="/api/v1/analytics", tags=["Analytics"])
app.include_router(hospital.router, prefix="/api/v1/hospital", tags=["Hospital Data"])
app.include_router(notifications.router, prefix="/api/v1/notifications", tags=["Notifications"])

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # Keep connection alive
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)

@app.get("/")
def root():
    return {"message": "EPISENCE API is running"}
