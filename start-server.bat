@echo off
title Mirzaliyev Jahongirmirzo - Link Hub Server
echo ========================================================
echo   Shaxsiy Link Hub Localhost Serverini ishga tushirish
echo ========================================================
start http://localhost:3000/
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0server.ps1" -Port 3000
pause
