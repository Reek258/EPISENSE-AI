# EPISENCE Backend Startup Script
# Run this from anywhere: powershell -File .\backend\run.ps1
# OR: from inside the backend folder: .\run.ps1

$ErrorActionPreference = "Stop"

# Resolve the backend directory regardless of where the script is invoked from
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
Set-Location $ScriptDir

Write-Host "=== EPISENCE Backend ===" -ForegroundColor Cyan
Write-Host "Working directory: $(Get-Location)" -ForegroundColor Gray

# Check venv exists
if (-not (Test-Path ".\venv\Scripts\python.exe")) {
    Write-Host "[ERROR] Virtual environment not found at .\venv\" -ForegroundColor Red
    Write-Host "Create it with:  python -m venv venv" -ForegroundColor Yellow
    Write-Host "Then install:    .\venv\Scripts\pip install -r requirements.txt" -ForegroundColor Yellow
    exit 1
}

Write-Host "Starting server with virtual environment..." -ForegroundColor Green
.\venv\Scripts\python.exe -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
