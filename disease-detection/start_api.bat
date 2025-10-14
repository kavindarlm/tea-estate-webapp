@echo off
echo ============================================================
echo Tea Leaf Disease Detection API
echo ============================================================
echo.

REM Check if model file exists (check for v2 first, then v1, then old .h5 format)
if exist "tea_disease_model_v2.keras" (
    echo ✅ Model file found: tea_disease_model_v2.keras
) else if exist "tea_disease_model_v1.keras" (
    echo ✅ Model file found: tea_disease_model_v1.keras
) else if exist "tea_disease_model.h5" (
    echo ✅ Model file found: tea_disease_model.h5
) else (
    echo ⚠️  Model file not found!
    echo.
    echo Looking for one of:
    echo   - tea_disease_model_v2.keras
    echo   - tea_disease_model_v1.keras
    echo   - tea_disease_model.h5
    echo.
    echo Please train the model first:
    echo   1. Run: jupyter notebook train_model.ipynb
    echo   2. Click "Run All" to train the model
    echo   3. Wait for training to complete
    echo   4. Run this script again
    echo.
    pause
    exit /b 1
)
echo.
echo Starting Flask API server...
echo.
echo 🌐 API will be available at: http://localhost:5000
echo.
echo Endpoints:
echo   GET  /health        - Check API status
echo   POST /predict       - Predict disease from image
echo   GET  /classes       - Get list of disease classes
echo.
echo Press Ctrl+C to stop the server
echo.
echo ============================================================

REM Start the Flask application (works with Anaconda or system Python)
python app.py
