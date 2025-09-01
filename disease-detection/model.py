"""
Tea Leaf Disease Detection Model
Based on the Kaggle tea leaves disease classification model
Simplified version for easy deployment
"""

import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
import numpy as np
from PIL import Image
import io
import base64

class TeaLeafDiseaseDetector:
    def __init__(self):
        self.model = None
        self.class_names = [
            'Healthy',
            'Anthracnose', 
            'Bird Eye Spot',
            'Brown Blight',
            'Red Leaf Spot',
            'Algal Leaf'
        ]
        self.img_height = 150
        self.img_width = 150
        
    def create_model(self):
        """Create a simple CNN model for tea leaf disease classification"""
        model = keras.Sequential([
            layers.Rescaling(1./255),
            layers.Conv2D(32, 3, activation='relu'),
            layers.MaxPooling2D(),
            layers.Conv2D(32, 3, activation='relu'),
            layers.MaxPooling2D(),
            layers.Conv2D(32, 3, activation='relu'),
            layers.MaxPooling2D(),
            layers.Flatten(),
            layers.Dense(128, activation='relu'),
            layers.Dropout(0.5),
            layers.Dense(len(self.class_names))
        ])
        
        model.compile(
            optimizer='adam',
            loss=tf.keras.losses.SparseCategoricalCrossentropy(from_logits=True),
            metrics=['accuracy']
        )
        
        self.model = model
        return model
    
    def load_model(self, model_path):
        """Load a pre-trained model"""
        try:
            self.model = keras.models.load_model(model_path)
            return True
        except Exception as e:
            print(f"Error loading model: {e}")
            return False
    
    def preprocess_image(self, image_data):
        """Preprocess image for prediction"""
        try:
            # If image_data is base64 string, decode it
            if isinstance(image_data, str):
                image_data = base64.b64decode(image_data)
            
            # Open image
            image = Image.open(io.BytesIO(image_data))
            
            # Convert to RGB if necessary
            if image.mode != 'RGB':
                image = image.convert('RGB')
            
            # Resize image
            image = image.resize((self.img_width, self.img_height))
            
            # Convert to numpy array
            img_array = np.array(image)
            img_array = np.expand_dims(img_array, axis=0)
            
            return img_array
        except Exception as e:
            print(f"Error preprocessing image: {e}")
            return None
    
    def predict_disease(self, image_data):
        """Predict disease from image"""
        if self.model is None:
            return {
                'error': 'Model not loaded',
                'success': False
            }
        
        try:
            # Preprocess image
            processed_image = self.preprocess_image(image_data)
            if processed_image is None:
                return {
                    'error': 'Failed to process image',
                    'success': False
                }
            
            # Make prediction
            predictions = self.model.predict(processed_image)
            score = tf.nn.softmax(predictions[0])
            
            # Get predicted class
            predicted_class_index = np.argmax(score)
            predicted_class = self.class_names[predicted_class_index]
            confidence = float(100 * np.max(score))
            
            # Get all class probabilities
            all_predictions = []
            for i, class_name in enumerate(self.class_names):
                all_predictions.append({
                    'class': class_name,
                    'confidence': float(100 * score[i])
                })
            
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
        disease_info = {
            'Healthy': {
                'description': 'The tea leaf appears to be healthy with no visible signs of disease.',
                'treatment': 'Continue regular care and monitoring.',
                'severity': 'None'
            },
            'Anthracnose': {
                'description': 'A fungal disease causing dark, sunken lesions on leaves.',
                'treatment': 'Apply fungicide, improve air circulation, remove infected leaves.',
                'severity': 'Moderate to High'
            },
            'Bird Eye Spot': {
                'description': 'Circular spots with gray centers and dark borders, resembling bird eyes.',
                'treatment': 'Use copper-based fungicides, ensure proper drainage.',
                'severity': 'Moderate'
            },
            'Brown Blight': {
                'description': 'Brown patches on leaves that can spread rapidly.',
                'treatment': 'Apply appropriate fungicides, remove infected plant parts.',
                'severity': 'High'
            },
            'Red Leaf Spot': {
                'description': 'Reddish spots on leaf surface, often circular.',
                'treatment': 'Fungicide application, improve ventilation.',
                'severity': 'Moderate'
            },
            'Algal Leaf': {
                'description': 'Green to brown spots caused by algal infection.',
                'treatment': 'Reduce humidity, apply copper fungicides.',
                'severity': 'Low to Moderate'
            }
        }
        
        return disease_info.get(disease_name, {
            'description': 'Unknown disease detected.',
            'treatment': 'Consult with plant pathologist.',
            'severity': 'Unknown'
        })

# Create a global instance
detector = TeaLeafDiseaseDetector()

# Initialize with a simple model (in production, load a trained model)
detector.create_model()
