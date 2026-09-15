@echo off
chcp 65001 >nul
cd /d "%~dp0"

set "PY="
if exist "%LOCALAPPDATA%\Programs\Python\Python312\python.exe" set "PY=%LOCALAPPDATA%\Programs\Python\Python312\python.exe"
if not defined PY if exist "%LOCALAPPDATA%\Programs\Python\Python313\python.exe" set "PY=%LOCALAPPDATA%\Programs\Python\Python313\python.exe"

if not defined PY (
  echo 这台电脑还没安装 Python 3.12 或 3.13。
  echo 也可以把 web 文件夹丢到任意静态托管，或用浏览器直接打开 web\index.html。
  pause
  exit /b 1
)

start "" "%PY%" -m http.server 8765 --bind 127.0.0.1 --directory "%~dp0web"
timeout /t 1 /nobreak >nul
start "" http://127.0.0.1:8765/
