@echo off
chcp 65001 >nul
echo ===========================================
echo   🚀 Docsify 全量覆盖同步（包含大小写）
echo ===========================================

REM 确保在正确分支
git fetch origin main

REM 添加所有文件（包括新建、删除、大小写变化）
echo 添加所有文件...
git add -A

REM 提交更改
for /f "tokens=1-5 delims=/: " %%d in ("%date% %time%") do (
    set datestr=%%d-%%e-%%f_%%g
)
echo 📝 提交更改...
git commit -m "Full force sync on %datestr%" >nul 2>&1

REM 强制推送覆盖远程
echo 🚀 正在推送到 https://github.com/Harvey-txy/docs.git ...
git push https://github.com/Harvey-txy/docs.git main --force

echo.
echo ✅ 全量同步完成！（包括大小写差异）
echo 🌐 访问: https://harvey-txy.github.io/docs/
pause
