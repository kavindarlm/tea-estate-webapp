# 🍃 Tea Leaf Disease Detection

AI-powered tea leaf disease classification based on the [Kaggle Tea Leaves Disease Classification](https://www.kaggle.com/code/rizqyad/tea-leaves-disease-classification) model.

## 📊 Dataset Overview

**885 images** across **8 disease classes**:
- algal leaf (113 images)
- Anthracnose (100 images)
- bird eye spot (100 images)
- brown blight (113 images)
- gray light (100 images)
- healthy (74 images)
- red leaf spot (143 images)
- white spot (142 images)

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd disease-detection
pip install -r requirements.txt
```

**Note:** You're using Anaconda, so packages will install to your `(base)` environment.

### 2. Train the Model

**Open the Jupyter Notebook:**
```bash
jupyter notebook train_model.ipynb
```

Then run all cells to train the model.

**Training time:** 40-60 minutes on CPU
**Expected accuracy:** 85-95%

### 3. Start the API
```bash
# Easy way (Windows)
start_api.bat

# Or manually
python app.py
```

API available at: `http://localhost:5000`

## 📁 Project Files

### Core Files
- `train_model.ipynb` - **Jupyter notebook for training the model**
- `model.py` - Model architecture and prediction logic
- `app.py` - Flask API server
- `requirements.txt` - Python dependencies

### Helper Scripts (Windows)
- `setup_gpu.bat` - (Optional) GPU acceleration setup
- `start_api.bat` - Start API server

### Dataset
- `data-set/` - Training images organized by disease class

## 🎯 Model Architecture

Deep CNN with:
- 4 Convolutional blocks (32→64→128→256 filters)
- Batch Normalization
- MaxPooling & Dropout
- 2 Dense layers (512, 256 neurons)
- Softmax output (8 classes)

**Features:**
- Data augmentation (rotation, zoom, flip)
- Early stopping
- Learning rate reduction
- Model checkpointing

## 🧪 Testing

Once training is complete, start the API to test predictions:

```bash
# Start API server
start_api.bat
# Or: python app.py
```

API will be available at `http://localhost:5000`

## 🌐 API Endpoints

### Health Check
```
GET /health
```

### Predict Disease
```
POST /predict
Content-Type: application/json

{
  "image": "base64_encoded_image_data"
}
```

**Response:**
```json
{
  "success": true,
  "predicted_class": "brown blight",
  "confidence": 94.23,
  "is_healthy": false,
  "all_predictions": [...],
  "disease_info": {
    "description": "...",
    "treatment": "...",
    "severity": "High"
  }
}
```

### Get Classes
```
GET /classes
```

## 📈 Training Process

The Jupyter notebook (`train_model.ipynb`) guides you through:
1. ✅ Loading and analyzing your dataset
2. ✅ Visualizing class distribution and sample images
3. ✅ Building the deep CNN architecture
4. ✅ Training with data augmentation
5. ✅ Evaluating performance with confusion matrix
6. ✅ Generating prediction visualizations

**Output files after training:**
- `tea_disease_model.h5` - Trained model
- `training_history.png` - Accuracy/loss curves
- `confusion_matrix.png` - Performance matrix
- `sample_predictions.png` - Visual examples

## 🎓 Disease Classes

1. **algal leaf** - Algal infection
2. **Anthracnose** - Fungal disease with dark lesions
3. **bird eye spot** - Circular spots resembling bird eyes
4. **brown blight** - Brown patches on leaves
5. **gray light** - Gray discoloration from fungal infection
6. **healthy** - No disease detected
7. **red leaf spot** - Reddish circular spots
8. **white spot** - White fungal spots

## ⚙️ Customization

Open `train_model.ipynb` and modify the configuration cell:

```python
# Training configuration
IMG_HEIGHT = 224      # Change image size (128, 150, or 224)
IMG_WIDTH = 224
BATCH_SIZE = 16       # Reduce if out of memory (8, 16, or 32)
EPOCHS = 75           # More epochs for better accuracy
VALIDATION_SPLIT = 0.2
```

## ⚠️ Troubleshooting

### Out of Memory
In the notebook configuration cell, reduce batch size:
```python
BATCH_SIZE = 16  # or 8
```

### Training Too Slow
- Use fewer epochs: `EPOCHS = 30`
- Reduce image size: `IMG_HEIGHT = 128, IMG_WIDTH = 128`
- Install GPU version: `pip install tensorflow[and-cuda]==2.20.0`

### Low Accuracy
- Train for more epochs: `EPOCHS = 75`
- Collect more training images
- Verify image labels are correct

## 📚 Documentation

- **Training Notebook**: `train_model.ipynb` (interactive, step-by-step)
- **Kaggle Reference**: https://www.kaggle.com/code/rizqyad/tea-leaves-disease-classification

## 🔧 Requirements

- Python 3.8+
- TensorFlow 2.20.0
- Jupyter Notebook
- Flask 2.3.3
- See `requirements.txt` for full list

## 🎉 Workflow

```
1. Install Dependencies  → pip install -r requirements.txt
2. Open Notebook         → jupyter notebook train_model.ipynb
3. Run All Cells         → Train model interactively
4. Review Results        → Check generated plots in notebook
5. Start API             → start_api.bat or python app.py
6. Integrate             → Use API in your web app
```

## 📖 Next Steps

1. ✅ Dataset is ready (885 images)
2. ▶️ Open and run `train_model.ipynb` in Jupyter
3. 📊 Review accuracy metrics in the notebook
4. 🧪 Test with the Flask API
5. 🚀 Deploy API for production

---

**Ready to train?** Open `train_model.ipynb` in Jupyter Notebook and run all cells! 🚀🍃
