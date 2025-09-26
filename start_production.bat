@echo off
echo Starting ClickPassagens Production Server...
echo.

REM Ativar ambiente virtual
call .venv\Scripts\activate.bat

REM Inicializar banco de dados se necessário
python init_db.py

REM Iniciar servidor Gunicorn
echo Starting Gunicorn with production configuration...
gunicorn --config gunicorn.conf.py main:app

pause
