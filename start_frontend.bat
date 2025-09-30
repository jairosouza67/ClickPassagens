@echo off
echo ====================================
echo    ClickPassagens - Frontend Server  
echo ====================================
echo.
echo Iniciando servidor Vite (React)...
echo.
echo IMPORTANTE: Mantenha esta janela aberta!
echo Para parar o servidor, pressione Ctrl+C
echo.

cd /d "%~dp0"
npm run dev

pause