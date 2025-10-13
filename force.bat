@echo off
chcp 65001 >nul
echo ====================================
echo   🚀 Docsify 全量覆盖上传脚本
echo ====================================

REM 拉取远程最新分支（防止引用错误）
echo.
echo 🔄 正在确保分支正确...
git fetch origin main

REM 添加所有更改
echo.
echo 添加本地所有文件...
git add -A

REM 获取当前时间
for /f "tokens=1-5 delims=/: " %%d in ("%date% %time%") do (
    set datestr=%%d-%%e-%%f_%%g
)

REM 提交更改
echo.
echo 📝 提交更改...
git commit -m "force update on %datestr%" >nul 2>&1

REM 强制推送覆盖远程
echo.
echo 🚀 正在推送并覆盖远程内容...
git push origin main --force

echo.
echo ✅ 已成功覆盖远程仓库！
echo 🌐 访问你的 Docsify 页面: https://harvey-txy.github.io/pdoc/
pause
