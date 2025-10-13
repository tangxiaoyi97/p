@echo off
chcp 65001 >nul
title 🚀 Docsify 自助更新脚本
echo =============================================
echo        🚀 Docsify Git 同步工具
echo =============================================
echo  1. 普通更新（提交并推送改动）
echo  2. 强制覆盖（用本地完全覆盖远程）
echo  3. 拉取远程（更新本地为远程版本）
echo  4. 退出
echo =============================================

set /p mode=请选择操作模式（1/2/3/4）： 

if "%mode%"=="1" goto NORMAL
if "%mode%"=="2" goto FORCE
if "%mode%"=="3" goto PULL
if "%mode%"=="4" exit
echo 无效选项，请重新运行。
pause
exit

:NORMAL
echo.
echo 🌱 执行普通更新...
git add -A
for /f "tokens=1-5 delims=/: " %%d in ("%date% %time%") do (
    set datestr=%%d-%%e-%%f_%%g
)
git commit -m "normal update on %datestr%" >nul 2>&1
git push origin docs
echo ✅ 普通更新完成！
goto END

:FORCE
echo.
echo ⚠️ 执行强制覆盖（远程将被替换）...
git add -A
for /f "tokens=1-5 delims=/: " %%d in ("%date% %time%") do (
    set datestr=%%d-%%e-%%f_%%g
)
git commit -m "force sync on %datestr%" >nul 2>&1
git push origin docs --force
echo ✅ 强制覆盖完成！（远程已被本地版本替换）
goto END

:PULL
echo.
echo 🔄 从远程拉取更新到本地...
git pull origin docs --allow-unrelated-histories
echo ✅ 本地已更新为远程版本。
goto END

:END
echo.
echo 🌐 访问：https://harvey-txy.github.io/documents/
pause
exit
