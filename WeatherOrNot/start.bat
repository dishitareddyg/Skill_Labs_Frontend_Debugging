@echo off
title Weather or Not
echo Starting Weather or Not...
echo.
echo This app runs entirely offline. No server or internet connection is needed.
echo.

rem Work from the folder that contains this file, wherever it was unzipped.
cd /d "%~dp0"

if not exist "index.html" (
    echo ERROR: index.html was not found next to start.bat.
    echo Make sure you unzipped the whole WeatherOrNot folder first.
    echo.
    pause
    exit /b 1
)

rem Open the page in your default browser.
start "" "%~dp0index.html"

echo Opened index.html in your default browser.
echo You can close this window.
timeout /t 5 >nul
