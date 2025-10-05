@echo off
echo ========================================
echo  Starting CivitAI Model Manager...
========================================
echo.
echo Server will start on http://localhost:5000
echo Press Ctrl+C to stop the server
echo.

REM Check if node_modules exists
if not exist "node_modules\" (
    echo [ERROR] Dependencies not installed!
    echo Please run setup.bat first to install dependencies.
    pause
    exit /b 1
)

REM Set environment variable and run with npm
set NODE_ENV=development
call npm run dev
