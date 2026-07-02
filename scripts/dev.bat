@echo off
REM kanaAI 开发环境一键启动 (Windows)
REM 用法: 双击运行,或在 cmd 中执行 scripts\dev.bat

chcp 65001 >nul
setlocal

echo.
echo ========================================
echo   kanaAI 开发环境启动中...
echo ========================================
echo.

REM 项目根目录
cd /d "%~dp0\.."

REM ===== 1. 检查 Docker =====
echo [1/4] 检查 Docker 状态...
where docker >nul 2>&1
if errorlevel 1 (
    echo [X] 未找到 Docker,请先安装 Docker Desktop
    pause
    exit /b 1
)

docker info >nul 2>&1
if errorlevel 1 (
    echo [!] Docker 未运行,正在启动 Docker Desktop...
    start "" "C:\Program Files\Docker\Docker\Docker Desktop.exe"
    echo 等待 Docker 启动...
    :WAIT_DOCKER
    timeout /t 3 /nobreak >nul
    docker info >nul 2>&1
    if errorlevel 1 goto WAIT_DOCKER
    echo [OK] Docker 已启动
) else (
    echo [OK] Docker 运行中
)

REM ===== 2. 启动 PostgreSQL =====
echo.
echo [2/4] 检查 PostgreSQL 容器...
set CONTAINER_NAME=kanaai-postgres
set POSTGRES_PORT=5433
set DB_USER=kanaai
set DB_PASSWORD=test123
set DB_NAME=kanaai

docker ps -a --format "{{.Names}}" | findstr /b "%CONTAINER_NAME%" >nul 2>&1
if errorlevel 1 (
    echo 创建新的 PostgreSQL 容器...
    docker run -d --name %CONTAINER_NAME% -e POSTGRES_USER=%DB_USER% -e POSTGRES_PASSWORD=%DB_PASSWORD% -e POSTGRES_DB=%DB_NAME% -p %POSTGRES_PORT%:5432 postgres:16-alpine >nul
    if errorlevel 1 (
        echo [X] 创建容器失败
        pause
        exit /b 1
    )
    echo [OK] 容器已创建
) else (
    echo 启动已存在的容器...
    docker start %CONTAINER_NAME% >nul 2>&1
    echo [OK] 容器已启动
)

echo 等待 PostgreSQL 就绪...
:WAIT_PG
timeout /t 2 /nobreak >nul
docker exec %CONTAINER_NAME% pg_isready -U %DB_USER% >nul 2>&1
if errorlevel 1 goto WAIT_PG
echo [OK] PostgreSQL 已就绪 ^(端口 %POSTGRES_PORT%^)

REM ===== 3. 检查迁移 =====
echo.
echo [3/4] 检查数据库迁移...
if not exist "prisma\migrations" (
    echo [!] 未发现迁移文件,执行 init 迁移...
    call npx prisma migrate dev --name init
) else (
    echo [OK] 迁移文件已存在
)

REM ===== 4. 检查种子数据 =====
echo.
echo [4/4] 检查种子数据...
docker exec %CONTAINER_NAME% psql -U %DB_USER% -d %DB_NAME% -tAc "SELECT COUNT(*) FROM \"User\";" > "%TEMP%\user_count.txt" 2>nul
set /p USER_COUNT=<"%TEMP%\user_count.txt"
del "%TEMP%\user_count.txt" 2>nul
if "%USER_COUNT%"=="0" (
    echo [!] 未发现测试用户,运行 seed...
    call npx tsx prisma/seed.ts
) else (
    echo [OK] 种子数据已存在 ^(用户数: %USER_COUNT%^)
)

echo.
echo ========================================
echo   kanaAI 已就绪
echo.
echo   数据库: postgresql://kanaai:***@localhost:%POSTGRES_PORT%/%DB_NAME%
echo   应用:   http://localhost:3000
echo   测试账号: dev@kanaai.local / dev12345678
echo.
echo   按 Ctrl+C 停止开发服务器
echo ========================================
echo.

REM ===== 5. 启动 Next.js =====
call npm run dev
