@echo off
echo ========================================
echo  ClickPassagens - Iniciando DEV MODE
echo ========================================
echo.

echo [1/3] Verificando Backend...
tasklist /FI "IMAGENAME eq python.exe" 2>NUL | find /I /N "python.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo Backend Python ja esta rodando!
) else (
    echo Iniciando Backend Python...
    start cmd /k "title ClickPassagens - Backend && cd /d %~dp0 && .\.venv\Scripts\activate.bat && python main.py"
    timeout /t 3 >NUL
)

echo.
echo [2/3] Verificando Node.js...
where node >NUL 2>NUL
if %ERRORLEVEL% NEQ 0 (
    echo ERRO: Node.js nao encontrado! Instale em https://nodejs.org
    pause
    exit /b 1
)

echo.
echo [3/3] Iniciando Frontend (Vite Dev Server)...
echo.
echo ========================================
echo  IMPORTANTE: Use http://localhost:5173
echo  NAO use a pasta static/
echo ========================================
echo.

npm run dev

pause
