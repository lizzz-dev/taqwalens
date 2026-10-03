# TaqwaLens One-Click Development Launcher for PowerShell
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  TAQWALENS: Halal Compliance & E-Code Auditor" -ForegroundColor Cyan
Write-Host "  Launching Backend API & Frontend Studio..." -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan

$RootPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $RootPath

# Verify backend virtual environment
$PythonExe = Join-Path $RootPath "backend\venv\Scripts\python.exe"
$UvicornExe = Join-Path $RootPath "backend\venv\Scripts\uvicorn.exe"

if (-not (Test-Path $PythonExe)) {
    Write-Host "[ERROR] Virtual environment not found at $PythonExe" -ForegroundColor Red
    Write-Host "Please create it using: python -m venv backend\venv" -ForegroundColor Yellow
    exit 1
}

Write-Host "`n[1/2] Launching Backend (FastAPI / Uvicorn on port 8000)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$RootPath'; & '$UvicornExe' backend.main:app --host 0.0.0.0 --port 8000 --reload"

Write-Host "[2/2] Launching Frontend (Next.js on port 3000)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$RootPath\frontend'; npm run dev"

Write-Host "`nServices launched successfully:" -ForegroundColor Cyan
Write-Host "  - Frontend:     http://localhost:3000" -ForegroundColor White
Write-Host "  - API Swagger:  http://localhost:8000/docs" -ForegroundColor White
Write-Host "  - Health Check: http://localhost:8000/health`n" -ForegroundColor White
