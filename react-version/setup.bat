@echo off
echo ========================================
echo   AI JEE Roadmap Generator Setup
echo   React.js Full-Stack Version
echo ========================================
echo.

echo [1/5] Setting up Backend...
cd backend
if not exist node_modules (
    echo Installing backend dependencies...
    npm install
) else (
    echo Backend dependencies already installed.
)

echo.
echo [2/5] Setting up environment files...
if not exist .env (
    echo Creating backend .env file...
    copy .env.example .env
    echo Please edit backend/.env with your API keys!
) else (
    echo Backend .env file already exists.
)

cd ..

echo.
echo [3/5] Setting up Frontend...
cd frontend
if not exist node_modules (
    echo Installing frontend dependencies...
    npm install
) else (
    echo Frontend dependencies already installed.
)

echo.
echo [4/5] Setting up frontend environment...
if not exist .env (
    echo Creating frontend .env file...
    copy .env.example .env
) else (
    echo Frontend .env file already exists.
)

cd ..

echo.
echo [5/5] Setup Complete!
echo.
echo ========================================
echo   Next Steps:
echo ========================================
echo 1. Edit backend/.env with your API keys:
echo    - GEMINI_API_KEY
echo    - YOUTUBE_API_KEY  
echo    - SEARCH_ENGINE_ID (optional)
echo.
echo 2. Start the backend server:
echo    cd backend && npm run dev
echo.
echo 3. Start the frontend (in new terminal):
echo    cd frontend && npm start
echo.
echo 4. Open http://localhost:3000 in your browser
echo ========================================
echo.
pause
