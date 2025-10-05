@echo off
SETLOCAL EnableDelayedExpansion

echo ========================================
echo  CivitAI Model Manager - Setup Script
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed!
    echo Please download and install Node.js from https://nodejs.org/
    echo Recommended version: Node.js 20.x or higher
    pause
    exit /b 1
)

REM Display Node.js version
echo [INFO] Node.js detected:
node --version
echo.

REM Check if npm is available
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] npm is not available!
    echo Please reinstall Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo [INFO] npm detected:
npm --version
echo.

REM Install dependencies
echo [STEP 1/3] Installing dependencies...
echo This may take a few minutes...
echo.
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to install dependencies!
    echo Please check your internet connection and try again.
    pause
    exit /b 1
)

echo.
echo [SUCCESS] Dependencies installed successfully!
echo.

REM Check if .env file exists
if exist .env (
    echo [STEP 2/3] .env file already exists, skipping...
) else (
    if exist .env.example (
        echo [STEP 2/3] Creating .env file from template...
        copy .env.example .env >nul
        echo [SUCCESS] .env file created!
        echo Please edit .env file to add your configuration.
    ) else (
        echo [STEP 2/3] No .env.example found, creating basic .env...
        echo PORT=5000> .env
        echo NODE_ENV=development>> .env
        echo [SUCCESS] Basic .env file created!
    )
)
echo.

REM Setup complete
echo [STEP 3/3] Setup complete!
echo.
echo ========================================
echo  Next Steps:
echo ========================================
echo.
echo 1. Configure your settings:
echo    - Get your CivitAI API key from: https://civitai.com/user/account
echo    - Launch the app and go to Settings page
echo    - Enter your CivitAI API key
echo    - Optionally set your ComfyUI installation path
echo.
echo 2. Start the application:
echo    - Run: npm run dev
echo    - Or double-click: start.bat
echo.
echo 3. Access the application:
echo    - Open your browser and go to: http://localhost:5000
echo.
echo ========================================
echo.
echo Would you like to start the application now? (Y/N)
set /p START_NOW=

if /i "%START_NOW%"=="Y" (
    echo.
    echo Starting CivitAI Model Manager...
    echo Press Ctrl+C to stop the server.
    echo.
    set NODE_ENV=development
    npx cross-env NODE_ENV=development tsx server/index.ts
) else (
    echo.
    echo You can start the application later by running: start.bat
    echo.
)

pause
