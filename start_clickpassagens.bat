@echo off
echo ====================================
echo      ClickPassagens - Inicializar
echo ====================================
echo.
echo Iniciando Backend e Frontend...
echo.

REM Iniciar Backend Flask em janela separada
start "ClickPassagens Backend" "%~dp0start_backend.bat"

REM Aguardar 3 segundos para o backend inicializar
timeout /t 3 /nobreak >nul

REM Iniciar Frontend React em janela separada  
start "ClickPassagens Frontend" "%~dp0start_frontend.bat"

echo.
echo ✅ Servidores iniciados!
echo.
echo Backend:  http://127.0.0.1:5001
echo Frontend: http://localhost:5173
echo.
echo Pressione qualquer tecla para abrir o navegador...
pause >nul

REM Abrir navegador automaticamente
start http://localhost:5173

echo.
echo 🚀 ClickPassagens está rodando!
echo.
echo Para parar os servidores, feche as janelas abertas
echo ou pressione Ctrl+C em cada uma delas.
echo.
pause