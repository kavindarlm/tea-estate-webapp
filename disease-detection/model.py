"""
Tea Leaf Disease Detection Model
Based on the Kaggle tea leaves disease classification model
"""

import os
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
import numpy as np
from PIL import Image
import io
import base64

class TeaLeafDiseaseDetector:
    def __init__(self, model_path='tea_disease_model_v2.keras'):
        self.model = None
        # Class names MUST match the order from train_model.ipynb
        # These are set by train_ds.class_names (alphabetically sorted by TensorFlow)
        self.class_names = [
            'algal leaf',
            'Anthracnose', 
            'bird eye spot',
            'brown blight',
            'gray light',
            'healthy',
            'red leaf spot',
            'white spot'
        ]
        # Image dimensions must match training (224x224 from train_model.ipynb)
        self.img_height = 224
        self.img_width = 224
        
        # Get the absolute path to the model file
        current_dir = os.path.dirname(os.path.abspath(__file__))
        full_model_path = os.path.join(current_dir, model_path)
        
        # Try to load the trained model
        if not os.path.exists(full_model_path):
            raise FileNotFoundError(
                f"❌ Trained model file not found: {full_model_path}\n"
                f"Please ensure 'tea_disease_model.h5' exists in the disease-detection folder."
            )
        
        print(f"Loading trained model from {full_model_path}...")
        if not self.load_model(full_model_path):
            raise RuntimeError(
                f"❌ Failed to load trained model from {full_model_path}\n"
                f"The model file may be corrupted or incompatible with this TensorFlow version."
            )
        
        print("✓ Trained model loaded successfully!")
    
    def load_model(self, model_path):
        """Load a pre-trained model"""
        try:
            self.model = keras.models.load_model(model_path)
            return True
        except Exception as e:
            print(f"Error loading model: {e}")
            return False
    
    def preprocess_image(self, image_data):
        """
        Preprocess image for prediction
        Matches the preprocessing from train_model.ipynb:
        - Resize to 224x224
        - Convert to RGB
        - Scale to [0, 1] range (done by model's Rescaling layer)
        - Add batch dimension
        """
        try:
            # If image_data is base64 string, decode it
            if isinstance(image_data, str):
                image_data = base64.b64decode(image_data)
            
            # Open image
            image = Image.open(io.BytesIO(image_data))
            
            # Convert to RGB if necessary (ensures 3 channels like training data)
            if image.mode != 'RGB':
                image = image.convert('RGB')
            
            # Resize to match training dimensions (224x224)
            image = image.resize((self.img_width, self.img_height), Image.BILINEAR)
            
            # Convert to numpy array with dtype uint8 (0-255 range)
            # The model's Rescaling(1./255) layer will normalize to [0, 1]
            img_array = np.array(image, dtype=np.uint8)
            
            # Add batch dimension: (224, 224, 3) -> (1, 224, 224, 3)
            img_array = np.expand_dims(img_array, axis=0)
            
            return img_array
            
        except Exception as e:
            print(f"Error preprocessing image: {e}")
            return None
    
    def predict_disease(self, image_data):
        """
        Predict disease from image
        Matches the inference approach from train_model.ipynb:
        - Preprocess image (resize, convert to RGB, normalize)
        - Get model predictions (logits)
        - Apply softmax to get probabilities
        - Return predicted class and confidence scores
        """
        if self.model is None:
            return {
                'error': 'Model not loaded',
                'success': False
            }
        
        try:
            # Preprocess image (resize to 224x224, RGB, uint8 format)
            processed_image = self.preprocess_image(image_data)
            if processed_image is None:
                return {
                    'error': 'Failed to process image',
                    'success': False
                }
            
            # Make prediction (model outputs logits due to from_logits=True in training)
            predictions = self.model.predict(processed_image, verbose=0)
            
            # Apply softmax to convert logits to probabilities
            # This matches the notebook's approach: tf.nn.softmax(predictions[0])
            score = tf.nn.softmax(predictions[0])
            
            # Get predicted class index and name
            predicted_class_index = np.argmax(score)
            predicted_class = self.class_names[predicted_class_index]
            confidence = float(100 * np.max(score))
            
            # Get all class probabilities sorted by confidence
            all_predictions = []
            for i, class_name in enumerate(self.class_names):
                all_predictions.append({
                    'class': class_name,
                    'confidence': float(100 * score[i])
                })
            
            # Sort predictions by confidence (highest first)
            all_predictions.sort(key=lambda x: x['confidence'], reverse=True)
            
            return {
                'success': True,
                'predicted_class': predicted_class,
                'confidence': confidence,
                'all_predictions': all_predictions,
                'is_healthy': predicted_class.lower() == 'healthy'
            }
            
        except Exception as e:
            return {
                'error': f'Prediction failed: {str(e)}',
                'success': False
            }
    
    def get_disease_info(self, disease_name):
        """Get information about the detected disease"""
        # Normalize disease name for matching
        disease_key = disease_name.lower()
        
        disease_info = {
            'healthy': {
                'description': 'The tea leaf appears to be healthy with no visible signs of disease.',
                'treatment': 'Continue regular care and monitoring.',
                'severity': 'None'
            },
            'anthracnose': {
                'description': 'A fungal disease causing dark, sunken lesions on leaves.',
                'treatment': 'Apply fungicide, improve air circulation, remove infected leaves.',
                'severity': 'Moderate to High'
            },
            'bird eye spot': {
                'description': 'Circular spots with gray centers and dark borders, resembling bird eyes.',
                'treatment': 'Use copper-based fungicides, ensure proper drainage.',
                'severity': 'Moderate'
            },
            'brown blight': {
                'description': 'Brown patches on leaves that can spread rapidly.',
                'treatment': 'Apply appropriate fungicides, remove infected plant parts.',
                'severity': 'High'
            },
            'red leaf spot': {
                'description': 'Reddish spots on leaf surface, often circular.',
                'treatment': 'Fungicide application, improve ventilation.',
                'severity': 'Moderate'
            },
            'algal leaf': {
                'description': 'Green to brown spots caused by algal infection.',
                'treatment': 'Reduce humidity, apply copper fungicides.',
                'severity': 'Low to Moderate'
            },
            'gray light': {
                'description': 'Gray discoloration on leaf surface, often due to fungal infection.',
                'treatment': 'Apply fungicides, improve air circulation and reduce humidity.',
                'severity': 'Moderate'
            },
            'white spot': {
                'description': 'White spots on leaves, usually caused by fungal pathogens.',
                'treatment': 'Remove infected leaves, apply appropriate fungicides.',
                'severity': 'Low to Moderate'
            }
        }
        
        return disease_info.get(disease_key, {
            'description': 'Unknown disease detected.',
            'treatment': 'Consult with plant pathologist.',
            'severity': 'Unknown'
        })

# Create a global instance - it will automatically load the trained model
detector = TeaLeafDiseaseDetector()
