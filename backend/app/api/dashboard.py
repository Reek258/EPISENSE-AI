from fastapi import APIRouter
from app.schemas.dashboard import DashboardSummaryResponse
from app.services.dashboard_service import get_dashboard_summary

router = APIRouter()

@router.get("/summary", response_model=DashboardSummaryResponse)
async def read_dashboard_summary():
    return await get_dashboard_summary()
