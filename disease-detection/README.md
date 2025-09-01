# Tea Leaf Disease Detection Setup

## Installation

1. Navigate to the disease-detection folder:
```bash
cd disease-detection
```

2. Run the setup script (Windows):
```bash
setup.bat
```

Or manually set up:
```bash
# Create a virtual environment
python -m venv disease_detection_env

# Activate the virtual environment (Windows)
disease_detection_env\Scripts\activate

# Install required packages
pip install -r requirements.txt
```

## Running the API

1. Start the Flask API server:
```bash
start_api.bat
```

Or manually start:
```bash
# Activate virtual environment first
disease_detection_env\Scripts\activate

# Start the server
python app.py
```

2. The API will be available at: http://localhost:5000

## API Endpoints

- `GET /health` - Check if the API is running
- `POST /predict` - Upload image and get disease prediction
- `GET /classes` - Get all supported disease classes

## Usage from Frontend

Send POST request to `/predict` with JSON body:
```json
{
  "image": "base64_encoded_image_data"
}
```

## Disease Classes

The model can detect the following tea leaf diseases:
- Healthy
- Anthracnose
- Bird Eye Spot
- Brown Blight
- Red Leaf Spot
- Algal Leaf

## Note

This is a simplified model for demonstration. For production use:
1. Train the model with a larger, more diverse dataset
2. Use a pre-trained model with better accuracy
3. Implement proper error handling and logging
4. Add authentication and rate limiting
