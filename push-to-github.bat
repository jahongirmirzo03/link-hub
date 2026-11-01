@echo off
title GitHub-ga Push qilish: link-hub
echo ========================================================
echo   Loyihani GitHub repozitoriyga push qilish
echo ========================================================
echo.
set "PATH=%LOCALAPPDATA%\Programs\Git\cmd;C:\Program Files\Git\cmd;%PATH%"

git config --local credential.helper manager
git branch -M main

echo O'zgarishlar saqlanmoqda (commit)...
git add .
git commit -m "Redesign: Complete shadcn/ui professional transformation" 2>nul

echo GitHub-ga push qilinmoqda...
echo Agar brauzer yoki oyna ochilsa, 'Sign in with your browser' tugmasini bosing.
echo.
git push -u origin main

echo.
echo ========================================================
if %ERRORLEVEL% EQU 0 (
    echo [MUVAFFAQIYAT] Loyiha GitHub-ga to'liq push qilindi!
) else (
    echo [XATOLIK] Push amalga oshmadi.
)
echo ========================================================
pause
