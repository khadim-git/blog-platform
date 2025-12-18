@echo off
echo Installing/Updating dependencies...
pip install -r requirements.txt

echo.
echo Starting FastAPI server...
python run_server.py

pause