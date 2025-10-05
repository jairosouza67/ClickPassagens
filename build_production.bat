@echo off
echo ========================================
echo  ClickPassagens - BUILD PARA PRODUCAO
echo ========================================
echo.

echo [1/5] Limpando builds antigos...
if exist "dist" (
    rmdir /s /q "dist"
    echo ✓ Pasta dist removida
)
if exist "static\assets" (
    rmdir /s /q "static\assets"
    echo ✓ Pasta static/assets removida
)
if exist "static\index.html" (
    del /q "static\index.html"
    echo ✓ static/index.html removido
)
echo.

echo [2/5] Verificando Node.js...
where node >NUL 2>NUL
if %ERRORLEVEL% NEQ 0 (
    echo ❌ ERRO: Node.js nao encontrado! Instale em https://nodejs.org
    pause
    exit /b 1
)
echo ✓ Node.js encontrado
echo.

echo [3/5] Instalando/verificando dependencias...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ❌ ERRO ao instalar dependencias!
    pause
    exit /b 1
)
echo ✓ Dependencias OK
echo.

echo [4/5] Fazendo build de producao...
echo.
echo IMPORTANTE: Usando .env.production
echo API_URL: https://clickpassagens.onrender.com
echo.
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo ❌ ERRO no build!
    pause
    exit /b 1
)
echo ✓ Build concluido
echo.

echo [5/5] Verificando arquivos gerados...
if not exist "dist\index.html" (
    echo ❌ ERRO: dist/index.html nao foi gerado!
    pause
    exit /b 1
)
echo ✓ Arquivos gerados em dist/
echo.

echo ========================================
echo  BUILD CONCLUIDO COM SUCESSO!
echo ========================================
echo.
echo Proximos passos:
echo 1. Teste local: npx serve dist -p 3000
echo 2. Deploy: git add . ^&^& git commit -m "Build atualizado" ^&^& git push
echo.
echo Arquivos em: dist/
echo.

pause
