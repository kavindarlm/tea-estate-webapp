@echo off
echo Starting Tea Leaf Disease Detection API...
echo.

REM Check if virtual environment exists
if not exist "disease_detection_env" (
    echo Virtual environment not found. Please run setup.bat first.
    pause
    exit /b 1
)

REM Activate virtual environment
call disease_detection_env\Scripts\activate.bat

echo Virtual environment activated.
echo Starting Flask API server...
echo.
echo The API will be available at: http://localhost:5000
echo Press Ctrl+C to stop the server
echo.

REM Start the Flask application
python app.py
