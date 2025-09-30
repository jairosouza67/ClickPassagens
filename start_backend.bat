@echo off
echo ====================================
echo    ClickPassagens - Backend Server
echo ====================================
echo.
echo Iniciando servidor Flask na porta 5001...
echo.
echo IMPORTANTE: Mantenha esta janela aberta!
echo Para parar o servidor, pressione Ctrl+C
echo.

cd /d "%~dp0"
call .venv\Scripts\activate.bat
python main.py

pause