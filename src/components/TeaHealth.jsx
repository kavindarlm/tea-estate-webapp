import React, { useState } from 'react';
import { PhotoIcon, ExclamationTriangleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

function TeaHealth() {
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [error, setError] = useState(null);

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedImage(file);
            setAnalysisResult(null);
            setError(null);
            
            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const analyzeImage = async () => {
        if (!selectedImage) {
            setError('Please select an image first');
            return;
        }

        setIsAnalyzing(true);
        setError(null);

        try {
            // Convert image to base64
            const reader = new FileReader();
            reader.onload = async (e) => {
                const base64Image = e.target.result.split(',')[1];
                
                try {
                    const response = await fetch('http://localhost:5000/predict', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            image: base64Image
                        })
                    });

                    if (!response.ok) {
                        throw new Error('Disease detection API is not available. Please make sure the Flask server is running.');
                    }

                    const result = await response.json();
                    
                    if (result.success) {
                        setAnalysisResult(result);
                    } else {
                        setError(result.error || 'Analysis failed');
                    }
                } catch (apiError) {
                    console.error('API Error:', apiError);
                    setError('Failed to connect to disease detection service. Please check if the API server is running on port 5000.');
                } finally {
                    setIsAnalyzing(false);
                }
            };
            reader.readAsDataURL(selectedImage);
        } catch (error) {
            console.error('Error:', error);
            setError('Failed to process image');
            setIsAnalyzing(false);
        }
    };

    const resetAnalysis = () => {
        setSelectedImage(null);
        setImagePreview(null);
        setAnalysisResult(null);
        setError(null);
    };

    const getSeverityColor = (severity) => {
        switch (severity?.toLowerCase()) {
            case 'none':
                return 'text-green-600 bg-green-100';
            case 'low':
            case 'low to moderate':
                return 'text-yellow-600 bg-yellow-100';
            case 'moderate':
                return 'text-orange-600 bg-orange-100';
            case 'high':
            case 'moderate to high':
                return 'text-red-600 bg-red-100';
            default:
                return 'text-gray-600 bg-gray-100';
        }
    };

    const getSeverityDescription = (severity) => {
        switch (severity?.toLowerCase()) {
            case 'none':
                return 'No threat to plant health. Continue normal care routine.';
            case 'low':
            case 'low to moderate':
                return 'Minor concern. Monitor regularly and apply basic preventive measures.';
            case 'moderate':
                return 'Moderate threat. Requires attention and treatment to prevent spread.';
            case 'high':
            case 'moderate to high':
                return 'Serious threat. Immediate action required to prevent significant crop loss.';
            default:
                return 'Severity level unknown. Consult with expert for proper assessment.';
        }
    };

    return (
        <div id="tea-health" className='flex-1 overflow-auto'>
            <div className="py-5">
                <div className="px-4 sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <h1 className="text-lg font-semibold text-gray-900">Tea Health</h1>
                        <p className="mt-2 text-sm text-gray-500">
                            Upload a tea leaf image to identify diseases and get treatment recommendations.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Image Upload Section */}
                        <div className="bg-white shadow rounded-lg p-6">
                            <h2 className="text-lg font-medium text-gray-900 mb-4">Upload Tea Leaf Image</h2>
                            
                            <div className="space-y-4">
                                {/* File Input */}
                                <div>
                                    <label htmlFor="image-upload" className="block text-sm font-medium text-gray-700 mb-2">
                                        Select Image
                                    </label>
                                    <div className="flex items-center justify-center w-full">
                                        <label htmlFor="image-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <PhotoIcon className="w-8 h-8 mb-3 text-gray-400" />
                                                <p className="mb-2 text-sm text-gray-500">
                                                    <span className="font-semibold">Click to upload</span> tea leaf image
                                                </p>
                                                <p className="text-xs text-gray-500">PNG, JPG or JPEG (MAX. 10MB)</p>
                                            </div>
                                            <input
                                                id="image-upload"
                                                type="file"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                            />
                                        </label>
                                    </div>
                                </div>

                                {/* Image Preview */}
                                {imagePreview && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Preview
                                        </label>
                                        <div className="border rounded-lg p-4">
                                            <img
                                                src={imagePreview}
                                                alt="Tea leaf preview"
                                                className="w-full h-64 object-cover rounded-lg"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex space-x-4">
                                    <button
                                        onClick={analyzeImage}
                                        disabled={!selectedImage || isAnalyzing}
                                        className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
                                    >
                                        {isAnalyzing ? 'Analyzing...' : 'Analyze Disease'}
                                    </button>
                                    
                                    {(selectedImage || analysisResult) && (
                                        <button
                                            onClick={resetAnalysis}
                                            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                                        >
                                            Reset
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Results Section */}
                        <div className="bg-white shadow rounded-lg p-6">
                            <h2 className="text-lg font-medium text-gray-900 mb-4">Analysis Results</h2>
                            
                            {/* Loading State */}
                            {isAnalyzing && (
                                <div className="flex items-center justify-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                                    <span className="ml-3 text-gray-600">Analyzing tea leaf...</span>
                                </div>
                            )}

                            {/* Error State */}
                            {error && (
                                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                                    <div className="flex">
                                        <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
                                        <div className="ml-3">
                                            <h3 className="text-sm font-medium text-red-800">Error</h3>
                                            <p className="mt-1 text-sm text-red-700">{error}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Results */}
                            {analysisResult && (
                                <div className="space-y-4">
                                    {/* Main Result */}
                                    <div className={`p-4 rounded-lg border ${analysisResult.is_healthy ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                                        <div className="flex items-center">
                                            {analysisResult.is_healthy ? (
                                                <CheckCircleIcon className="h-6 w-6 text-green-600" />
                                            ) : (
                                                <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
                                            )}
                                            <div className="ml-3">
                                                <h3 className={`text-lg font-medium ${analysisResult.is_healthy ? 'text-green-800' : 'text-red-800'}`}>
                                                    {analysisResult.predicted_class}
                                                </h3>
                                                <p className={`text-sm ${analysisResult.is_healthy ? 'text-green-600' : 'text-red-600'}`}>
                                                    Confidence: {analysisResult.confidence.toFixed(1)}%
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Disease Information */}
                                    {analysisResult.disease_info && (
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <h4 className="font-medium text-gray-900 mb-2">Disease Information</h4>
                                            <div className="space-y-2 text-sm text-gray-800">
                                                <p><strong>Description:</strong> {analysisResult.disease_info.description}</p>
                                                <p><strong>Treatment:</strong> {analysisResult.disease_info.treatment}</p>
                                                <div>
                                                    <div className="flex items-center mb-1">
                                                        <strong>Severity:</strong>
                                                        <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(analysisResult.disease_info.severity)}`}>
                                                            {analysisResult.disease_info.severity}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-gray-600 italic">
                                                        {getSeverityDescription(analysisResult.disease_info.severity)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* All Predictions */}
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h4 className="font-medium text-gray-900 mb-2">All Predictions</h4>
                                        <div className="space-y-1 text-gray-800">
                                            {analysisResult.all_predictions.map((prediction, index) => (
                                                <div key={index} className="flex justify-between items-center text-sm">
                                                    <span className={prediction.class === analysisResult.predicted_class ? 'font-medium' : ''}>
                                                        {prediction.class}
                                                    </span>
                                                    <span className="text-gray-600">
                                                        {prediction.confidence.toFixed(1)}%
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Default State */}
                            {!isAnalyzing && !error && !analysisResult && (
                                <div className="text-center py-8">
                                    <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">No analysis yet</h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Upload a tea leaf image to get started with disease detection.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Instructions */}
                    <div className="mt-8 bg-green-50 border border-green-200 rounded-md p-4">
                        <h3 className="text-sm font-medium text-green-800 mb-2">Instructions</h3>
                        <ul className="text-sm text-green-700 space-y-1">
                            <li>• Take a clear photo of the tea leaf in good lighting</li>
                            <li>• Ensure the leaf fills most of the image frame</li>
                            <li>• Avoid blurry or dark images for better accuracy</li>
                            <li>• The system can detect: Healthy, Anthracnose, Bird Eye Spot, Brown Blight, Red Leaf Spot, and Algal Leaf</li>
                        </ul>
                    </div>

                    {/* API Status */}
                    <div className="mt-4 text-xs text-gray-500">
                        <p>Disease detection powered by AI.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TeaHealth;