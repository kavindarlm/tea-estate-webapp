@echo off
echo Setting up Tea Leaf Disease Detection API...
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo Error: Python is not installed or not in PATH
    echo Please install Python 3.8 or higher from https://python.org
    pause
    exit /b 1
)

echo Python found. Setting up virtual environment...

REM Create virtual environment if it doesn't exist
if not exist "disease_detection_env" (
    python -m venv disease_detection_env
    echo Virtual environment created.
) else (
    echo Virtual environment already exists.
)

REM Activate virtual environment
call disease_detection_env\Scripts\activate.bat

echo Installing required packages...
pip install -r requirements.txt

echo.
echo Setup complete!
echo.
echo To start the API server, run:
echo   start_api.bat
echo.
pause
