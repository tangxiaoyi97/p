@echo off
chcp 65001 >nul
title update tool v2.0
echo =============================================
echo         homemade update tool v2.0
echo =============================================
echo   1. publish normal update
echo   2. override
echo   3. pull to local
echo   4. quit
echo =============================================

set /p mode=select mode: (1/2/3/4)

if "%mode%"=="1" goto NORMAL
if "%mode%"=="2" goto FORCE
if "%mode%"=="3" goto PULL
if "%mode%"=="4" exit
echo invalid
pause
exit

:NORMAL
echo.
echo processing update
git add -A
for /f "tokens=1-5 delims=/: " %%d in ("%date% %time%") do set datestr=%%d-%%e-%%f_%%g
git commit -m "updated %datestr%" >nul 2>&1
git push origin docs
echo update completed
goto END

:FORCE
echo.
echo processing override
git add -A
for /f "tokens=1-5 delims=/: " %%d in ("%date% %time%") do set datestr=%%d-%%e-%%f_%%g
git commit -m "sync %datestr%" >nul 2>&1
git push origin docs --force
echo forced sync completed
goto END

:PULL
echo.
echo processing
git pull origin docs --allow-unrelated-histories
echo local updated
goto END

:END
echo.
echo 🌐 visit: https://tangxiaoyi97.github.io/documents/
pause
exit
