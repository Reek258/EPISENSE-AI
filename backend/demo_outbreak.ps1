# EPISENCE Outbreak Simulator (v2 - Force Inject)
$DATA_DIR = "$PSScriptRoot\data"
$CASES_FILE = "$DATA_DIR\cases.json"
$WEATHER_FILE = "$DATA_DIR\weather.json"

Write-Host "🌋 INITIATING EMERGENCY SIMULATION..." -ForegroundColor Red

# 1. Inject cases for Kothrud
$today = Get-Date -Format "yyyy-MM-dd"
$cases = @()
if (Test-Path $CASES_FILE) { $cases = Get-Content $CASES_FILE | ConvertFrom-Json }

# Add a massive cluster of cases
for ($i=1; $i -le 10; $i++) {
    $cases += @{
        id = "sim_" + (Get-Random)
        zone_id = "d867ca9c-93f0-410e-95d5-8717a6741797"
        disease_type = "Dengue"
        status = "Confirmed"
        reported_at = $today
    }
}
$cases | ConvertTo-Json -Depth 10 | Out-File $CASES_FILE -Encoding utf8

# 2. Inject Outbreak Weather
$weather = @{
    temp_c = 34.5
    humidity = 95
    precipitation_mm = 50.0
    condition = "Heavy Rain"
    recorded_at = $today
}
$weather | ConvertTo-Json -Depth 10 | Out-File $WEATHER_FILE -Encoding utf8

Write-Host "✅ EMERGENCY DATA INJECTED!" -ForegroundColor Green
Write-Host "👉 RESTART BACKEND NOW!" -ForegroundColor Yellow
