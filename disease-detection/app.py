"""
Flask API for Tea Leaf Disease Detection
Simple API server to handle image uploads and return disease predictions
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from model import detector

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'Tea Leaf Disease Detection API'
    })

@app.route('/predict', methods=['POST'])
def predict_disease():
    """Predict tea leaf disease from uploaded image"""
    try:
        # Check if request has image data
        if 'image' not in request.json:
            return jsonify({
                'error': 'No image data provided',
                'success': False
            }), 400
        
        # Get base64 image data
        image_data = request.json['image']
        
        # Remove data URL prefix if present
        if image_data.startswith('data:image'):
            image_data = image_data.split(',')[1]
        
        # Make prediction
        result = detector.predict_disease(image_data)
        
        if not result['success']:
            return jsonify(result), 500
        
        # Add disease information
        disease_info = detector.get_disease_info(result['predicted_class'])
        result['disease_info'] = disease_info
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({
            'error': f'Server error: {str(e)}',
            'success': False
        }), 500

@app.route('/classes', methods=['GET'])
def get_classes():
    """Get all supported disease classes"""
    return jsonify({
        'classes': detector.class_names,
        'total_classes': len(detector.class_names)
    })

if __name__ == '__main__':
    print("Starting Tea Leaf Disease Detection API...")
    print("API will be available at: http://localhost:5000")
    print("Endpoints:")
    print("  GET  /health - Health check")
    print("  POST /predict - Predict disease from image")
    print("  GET  /classes - Get all disease classes")
    
    # Run without debug mode to avoid auto-reload issues
    app.run(host='0.0.0.0', port=5000, debug=False)
