@echo off
title GitHub Repozitoriyga Yuklash (Push)
echo ========================================================
echo   Loyihani GitHub-ga yuklash: link-hub
echo ========================================================
set "PATH=%LOCALAPPDATA%\Programs\Git\cmd;%PATH%"

git add .
git commit -m "Initial commit: Shaxsiy linklar markazi" 2>nul
git branch -M main

echo GitHub-ga yuklanmoqda...
echo Agar brauzerda oyna ochilsa, 'Sign in with your browser' tugmasini bosing.
echo.
git push -u origin main

echo.
echo ========================================================
if %ERRORLEVEL% EQU 0 (
    echo [MUVAFFAQIYAT] Loyiha GitHub-ga yuklandi!
) else (
    echo [OGOHLANTIRISH] Yuklashda xatolik yuz berdi.
)
echo ========================================================
pause
