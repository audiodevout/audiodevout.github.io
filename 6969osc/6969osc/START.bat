@echo off
setlocal EnableDelayedExpansion

:: Step 0 - UAC elevation
>nul 2>&1 "%SYSTEMROOT%\system32\cacls.exe" "%SYSTEMROOT%\system32\config\system"
if '%errorlevel%' NEQ '0' (
    echo Requesting administrative privileges...
    goto UACPrompt
) else (
    goto gotAdmin
)

:UACPrompt
    echo Set UAC = CreateObject^("Shell.Application"^) > "%temp%\getadmin.vbs"
    set params= %*
    echo UAC.ShellExecute "cmd.exe", "/c ""%~s0"" %params:"=""%", "", "runas", 1 >> "%temp%\getadmin.vbs"
    "%temp%\getadmin.vbs"
    del "%temp%\getadmin.vbs"
    exit /B

:gotAdmin
    cd /d "%~dp0"

:: Read WS_PORT, OSC_PORT, OSC_HOST from config
for /f "tokens=*" %%p in ('node -e "try{const c=require('./config.json');console.log(c.wsPort||3000)}catch(e){console.log(3000)}" 2^>nul') do set WS_PORT=%%p
if not defined WS_PORT set WS_PORT=3000
for /f "tokens=*" %%p in ('node -e "try{const c=require('./config.json');console.log(c.oscPort||6969)}catch(e){console.log(6969)}" 2^>nul') do set OSC_PORT=%%p
if not defined OSC_PORT set OSC_PORT=6969
for /f "tokens=*" %%p in ('node -e "try{const c=require('./config.json');console.log(c.oscHost||'127.0.0.1')}catch(e){console.log('127.0.0.1')}" 2^>nul') do set OSC_HOST=%%p
if not defined OSC_HOST set OSC_HOST=127.0.0.1

:: Step 1 - Check Node.js
where node >nul 2>&1
if errorlevel 1 (
    echo [FAIL] Node.js not found. Open SETUP.md for install instructions.
    start notepad SETUP.md
    pause
    exit /B 1
)

:: Step 2 - Install dependencies if missing
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
    if errorlevel 1 (
        echo [FAIL] npm install failed. Check your network and try again.
        pause
        exit /B 1
    )
)

:: Step 3 - Detect LAN IP
for /f "tokens=*" %%i in ('node server/ip-detect.js 2^>nul') do set DETECTED_IP=%%i
if not defined DETECTED_IP set DETECTED_IP=ERROR
if "%DETECTED_IP%"=="" set DETECTED_IP=ERROR
if "%DETECTED_IP%"=="ERROR" (
    echo [FAIL] Could not detect WiFi IP. Are you connected to WiFi?
    pause
    exit /B 1
)
echo [OK] IP detected: %DETECTED_IP%

:: Step 4 - Write config (update detectedIp only)
node -e "const fs=require('fs');const p='./config.json';let c={};try{c=require(p)}catch(e){};c.detectedIp=process.argv[1];fs.writeFileSync(p,JSON.stringify(c,null,2))" "%DETECTED_IP%"
echo [OK] Config updated

:: Step 5 - Free the port
for /f "tokens=5" %%a in ('netstat -ano 2^>nul ^| findstr ":%WS_PORT%" ^| findstr "LISTENING"') do (
    taskkill /F /PID %%a >nul 2>&1
    echo [OK] Port %WS_PORT% freed
    goto :portDone
)
echo [OK] Port %WS_PORT% available
:portDone

:: Step 6 - Firewall rule (delete old, add fresh with profile=any)
netsh advfirewall firewall delete rule name="6969osc" >nul 2>&1
netsh advfirewall firewall delete rule name="6969osc-Node" >nul 2>&1
netsh advfirewall firewall add rule name="6969osc" dir=in action=allow protocol=TCP localport=%WS_PORT% profile=any
for /f "tokens=*" %%n in ('where node 2^>nul') do (
    netsh advfirewall firewall add rule name="6969osc-Node" dir=in action=allow program="%%n" protocol=TCP localport=%WS_PORT% profile=any >nul 2>&1
    goto :firewallDone
)
:firewallDone
echo [OK] Firewall rule active

:: Step 7 - Launch Node server
start "6969osc Server" /min node server/index.js
timeout /t 2 /nobreak >nul
echo [OK] Server starting on port %WS_PORT%

:: Step 8 - Show QR code in terminal
node server/qr-generate.js %DETECTED_IP% %WS_PORT%
echo [OK] Scan the QR code above with your phone
echo.
echo TIP: Test on PC first - open http://%DETECTED_IP%:%WS_PORT% in a browser.
echo      If PC works but phone fails, check SETUP.md troubleshooting.

:: Step 9 - Launch TouchDesigner (optional)
set TD_PATH=
for /f "tokens=*" %%t in ('node -e "try{const c=require('./config.json');const p=c.tdProjectPath||'';if(p)console.log(p)}catch(e){}" 2^>nul') do set TD_PATH=%%t
if defined TD_PATH if not "!TD_PATH!"=="" (
    if exist "!TD_PATH!" (
        tasklist | findstr /I "TouchDesigner.exe" >nul 2>&1
        if errorlevel 1 (
            start "" "!TD_PATH!"
            echo [OK] TouchDesigner launched
        )
    )
) else (
    echo [--] TouchDesigner path not configured ^(optional - see config.json^)
)

:: Step 10 - Final status
echo.
echo =======================================
echo   6969osc RUNNING
echo   Controller: http://%DETECTED_IP%:%WS_PORT%
echo   Scan the QR code above with your phone
echo.
echo   OSC:  server sends UDP to  %OSC_HOST%:%OSC_PORT%  ^(TouchDesigner etc.^)
echo         OSC In CHOP: Port %OSC_PORT%, Protocol UDP, Network 127.0.0.1
echo         Edit config.json: wsPort, oscPort, oscHost
echo =======================================
echo.
echo Press any key to shut down server...
pause >nul

taskkill /F /FI "WINDOWTITLE eq 6969osc Server*" >nul 2>&1
echo [OK] Server stopped.

endlocal
exit /B 0
