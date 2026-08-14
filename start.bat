@echo off
title Rann Mitra AI - Launcher
color 0A

echo.
echo  ============================================
echo   Rann Mitra AI - Starting...
echo  ============================================
echo.

:: Start backend in a new window
echo  [1/2] Starting Backend Server (port 5000)...
start "Rann Mitra AI - Backend" cmd /k "cd /d "%~dp0server" && echo. && echo  Backend starting... && echo. && node server.js"

:: Wait 3 seconds for backend to initialize
timeout /t 3 /nobreak >nul

:: Start frontend in a new window
echo  [2/2] Starting Frontend (port 5173)...
start "Rann Mitra AI - Frontend" cmd /k "cd /d "%~dp0client" && echo. && echo  Frontend starting... && echo. && node node_modules\.bin\vite"

:: Wait 4 seconds then open browser
timeout /t 4 /nobreak >nul

echo.
echo  [3/3] Opening browser...
start http://localhost:5173

echo.
echo  ============================================
echo   Both servers are running!
echo   Browser opened at http://localhost:5173
echo  ============================================
echo.
echo  Close the two other windows to stop the app.
pause
