@echo off
title GitHub Login va Push
echo ========================================================
echo   GitHub hisobingizga ulanish (jahongirmirzo03)
echo ========================================================
echo.
echo Hozir ekranda bir martalik tasdiqlash kodi chiqadi va brauzeringiz ochiladi.
echo Kodni brauzerga kiritib, 'Authorize' tugmasini bosing.
echo.
"C:\Program Files\GitHub CLI\gh.exe" auth login --hostname github.com --git-protocol https --web
echo.
echo ========================================================
echo   Git sozlanmoqda va loyiha yuklanmoqda...
echo ========================================================
"C:\Program Files\GitHub CLI\gh.exe" auth setup-git
set "PATH=%LOCALAPPDATA%\Programs\Git\cmd;%PATH%"
git branch -M main
git add .
git commit -m "Redesign: Complete shadcn/ui professional transformation" 2>nul
git push -u origin main
echo.
echo ========================================================
if %ERRORLEVEL% EQU 0 (
    echo [MUVAFFAQIYAT] Loyiha GitHub-ga muvaffaqiyatli yuklandi!
) else (
    echo [XATOLIK] Yuklash amalga oshmadi.
)
echo ========================================================
pause
