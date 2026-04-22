@echo off
setlocal EnableExtensions EnableDelayedExpansion
title LUMEVIO GitHub + Vercel Updater

set "PROJECT_DIR=C:\Users\user\Desktop\strona"

echo ==========================================
echo   LUMEVIO - Aktualizacja GitHub / Vercel
echo ==========================================
echo.

if not exist "%PROJECT_DIR%" (
    echo [BLAD] Nie znaleziono folderu projektu:
    echo %PROJECT_DIR%
    pause
    exit /b 1
)

cd /d "%PROJECT_DIR%"

if not exist ".git" (
    echo [BLAD] W folderze nie ma repozytorium Git.
    echo Sprawdz, czy projekt jest poprawnie podpiety do GitHub.
    pause
    exit /b 1
)

echo Folder projektu:
echo %PROJECT_DIR%
echo.

set /p COMMIT_MSG=Podaj opis zmian do commita [ENTER = update strony]: 
if "%COMMIT_MSG%"=="" set "COMMIT_MSG=update strony"

echo.
echo [1/5] Sprawdzam status...
git status --short
echo.

echo [2/5] Dodaje pliki...
git add .
if errorlevel 1 (
    echo [BLAD] Nie udalo sie wykonac git add .
    pause
    exit /b 1
)

echo.
echo [3/5] Tworze commit...
git commit -m "%COMMIT_MSG%"
if errorlevel 1 (
    echo.
    echo Uwaga: Git nie utworzyl commita.
    echo Jesli nie bylo zmian, to jest normalne.
)

echo.
echo [4/5] Wysylam na GitHub...
git push
if errorlevel 1 (
    echo [BLAD] Push nie udal sie.
    echo Mozliwe, ze trzeba najpierw wykonac git pull --rebase origin main
    pause
    exit /b 1
)

echo.
echo [5/5] Gotowe.
echo GitHub zostal zaktualizowany.
echo Vercel powinien automatycznie rozpoczac nowy deploy.
echo.

set /p OPEN_VERCEL=Czy otworzyc panel Vercel? [T/N]: 
if /I "%OPEN_VERCEL%"=="T" start https://vercel.com/dashboard

echo.
echo Aktualizacja zakonczona.
pause
