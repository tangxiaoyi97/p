@echo off
chcp 65001 >nul
echo ============================
echo   🚀 Docsify 一键更新脚本
echo ============================

REM 拉取远程仓库，防止冲突
echo.
echo 🔄 正在拉取远程更新...
git pull origin main --allow-unrelated-histories

REM 添加所有更改
echo.
echo 添加所有修改文件...
git add .

REM 获取当前时间作为提交信息
for /f "tokens=1-5 delims=/: " %%d in ("%date% %time%") do (
    set datestr=%%d-%%e-%%f_%%g
)

REM 提交更改
echo.
echo 📝 提交更改...
git commit -m "updated %datestr%"

REM 推送到远程仓库
echo.
echo 🚀 推送到 GitHub...
git push origin main

echo.
echo ✅ 上传完成！
pause
