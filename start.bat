@echo off
echo ========================================
echo  Starting CivitAI Model Manager...
echo ========================================
echo.
echo Server will start on http://localhost:5000
echo Press Ctrl+C to stop the server
echo.

set NODE_ENV=development
npx cross-env NODE_ENV=development tsx server/index.ts
