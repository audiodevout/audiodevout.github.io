@echo off
REM Web thesis preview — open in your browser:
cd /d "%~dp0"
echo.
echo  Thesis (web reading layout) — open in your browser:
echo    http://127.0.0.1:9233/
echo.
echo  Press Ctrl+C to stop the server.
echo.
py -3 -m http.server 9233 2>nul
if errorlevel 1 python -m http.server 9233
