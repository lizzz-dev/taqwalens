@echo off
title TaqwaLens Development Environment
echo ========================================================
echo   TAQWALENS: Halal Compliance & E-Code Auditor
echo   Launching Backend API & Frontend Studio...
echo ========================================================
echo.

cd /d "%~dp0"

:: Check if backend virtualenv exists
if not exist "backend\venv\Scripts\python.exe" (
    echo [ERROR] Virtual environment not found in backend\venv.
    echo Please create it using: python -m venv backend\venv
    pause
    exit /b 1
)

echo [1/2] Starting FastAPI Backend on http://localhost:8000 ...
start "TaqwaLens Backend (FastAPI)" cmd /k "backend\venv\Scripts\uvicorn.exe backend.main:app --host 0.0.0.0 --port 8000 --reload"

echo [2/2] Starting Next.js 14 Frontend on http://localhost:3000 ...
start "TaqwaLens Frontend (Next.js)" cmd /k "npm --prefix frontend run dev"

echo.
echo ========================================================
echo   Services are running!
echo   - Frontend: http://localhost:3000
echo   - Backend Docs: http://localhost:8000/docs
echo   - Health API: http://localhost:8000/health
echo ========================================================
echo Keep this window or the spawned terminal windows open.
echo.
pause
