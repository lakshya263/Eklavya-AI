@echo off
echo ========================================
echo   Starting AI JEE Roadmap Generator
echo   Development Servers
echo ========================================
echo.

echo Starting backend server...
cd backend
start "Backend Server" cmd /k "npm run dev"

timeout /t 3 /nobreak >nul

echo Starting frontend server...
cd ../frontend
start "Frontend Server" cmd /k "npm start"

echo.
echo ========================================
echo   Development servers started!
echo ========================================
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Press any key to exit...
pause >nul
