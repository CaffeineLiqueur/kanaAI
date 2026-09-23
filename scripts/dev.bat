@echo off
setlocal
cd /d "%~dp0\.."
if not exist ".env" (
  echo Missing .env. Copy .env.example and configure the database and session secret.
  exit /b 1
)
echo Starting the development server. No database migration or reset will be run.
call npm run dev
