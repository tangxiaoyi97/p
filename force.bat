@echo off
chcp 65001 >nul
echo ==============================================
echo   🚀 Docsify 全量上传覆盖脚本（含所有文件夹）
echo ==============================================

REM 确认当前目录为项目根目录
echo 当前目录：%cd%

REM 确保 git 初始化
if not exist ".git" (
    echo ❌ 未检测到 .git 仓库，请先运行 git init
    pause
    exit /b
)

REM 拉取远程分支信息，确保引用存在
echo.
echo 🔄 正在拉取远程分支信息...
git fetch origin main >nul 2>&1

REM 添加所有文件（包括新增、修改、删除）
echo.
echo ➕ 添加所有文件与文件夹...
git add -A

REM 获取当前日期时间作为提交信息
for /f "tokens=1-5 delims=/: " %%d in ("%date% %time%") do (
    set datestr=%%d-%%e-%%f_%%g
)

REM 提交更改
echo.
echo 📝 提交更改...
git commit -m "force full update on %datestr%" >nul 2>&1

REM 强制推送覆盖远程
echo.
echo 🚀 正在强制推送至 GitHub...
git push origin main --force

echo.
echo ✅ 已成功上传并覆盖远程仓库！
echo 🌐 访问你的 Docsify 页面：
echo     👉 https://harvey-txy.github.io/pdoc/
echo.
pause
