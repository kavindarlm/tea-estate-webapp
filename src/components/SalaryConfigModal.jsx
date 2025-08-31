import React, { useState, useEffect } from 'react';

function SalaryConfigModal({ onClose }) {
    const [baseAmount, setBaseAmount] = useState('');
    const [minimumKgThreshold, setMinimumKgThreshold] = useState('30');
    const [perKgRate, setPerKgRate] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchActiveConfig();
    }, []);

    const fetchActiveConfig = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('http://localhost:3000/api/salary/config?active=true');
            if (response.ok) {
                const config = await response.json();
                if (config) {
                    setBaseAmount(config.base_amount.toString());
                    setMinimumKgThreshold(config.minimum_kg_threshold.toString());
                    setPerKgRate(config.per_kg_rate.toString());
                }
            }
        } catch (error) {
            console.error('Failed to fetch salary config:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        
        if (!baseAmount || !minimumKgThreshold || !perKgRate) {
            alert('Please fill in all fields');
            return;
        }

        try {
            setIsSaving(true);
            const response = await fetch('http://localhost:3000/api/salary/config', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    base_amount: parseFloat(baseAmount),
                    minimum_kg_threshold: parseFloat(minimumKgThreshold),
                    per_kg_rate: parseFloat(perKgRate),
                    created_by: 1 // You can get this from user context/session
                }),
            });

            if (response.ok) {
                alert('Salary configuration updated successfully!');
                onClose();
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to update salary configuration');
            }
        } catch (error) {
            console.error('Failed to save salary config:', error);
            alert('Failed to save salary configuration: ' + error.message);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Salary Configuration
            </h2>
            
            {isLoading ? (
                <div className="text-center py-8">
                    <div className="text-gray-500">Loading current configuration...</div>
                </div>
            ) : (
                <form onSubmit={handleSave} className="space-y-6">
                    <div>
                        <label htmlFor="baseAmount" className="block text-sm font-medium text-gray-700 mb-2">
                            Base Amount (LKR)
                        </label>
                        <input
                            type="number"
                            id="baseAmount"
                            value={baseAmount}
                            onChange={(e) => setBaseAmount(e.target.value)}
                            placeholder="e.g., 1000"
                            step="0.01"
                            min="0"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
                            required
                        />
                        <p className="mt-1 text-sm text-gray-500">
                            Amount paid when employee reaches minimum kg threshold
                        </p>
                    </div>

                    <div>
                        <label htmlFor="minimumKgThreshold" className="block text-sm font-medium text-gray-700 mb-2">
                            Minimum Kg Threshold
                        </label>
                        <input
                            type="number"
                            id="minimumKgThreshold"
                            value={minimumKgThreshold}
                            onChange={(e) => setMinimumKgThreshold(e.target.value)}
                            placeholder="e.g., 30"
                            step="0.01"
                            min="0"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
                            required
                        />
                        <p className="mt-1 text-sm text-gray-500">
                            Minimum daily weight required to earn base amount
                        </p>
                    </div>

                    <div>
                        <label htmlFor="perKgRate" className="block text-sm font-medium text-gray-700 mb-2">
                            Per Kg Rate (LKR)
                        </label>
                        <input
                            type="number"
                            id="perKgRate"
                            value={perKgRate}
                            onChange={(e) => setPerKgRate(e.target.value)}
                            placeholder="e.g., 15"
                            step="0.01"
                            min="0"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
                            required
                        />
                        <p className="mt-1 text-sm text-gray-500">
                            Rate per kg for weight exceeding the threshold
                        </p>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <h4 className="text-sm font-semibold text-green-800 mb-2">💡 Example Calculation</h4>
                        <div className="text-sm text-green-700 space-y-1">
                            <p>If an employee collects <strong>35kg</strong> tea:</p>
                            <p>• Base amount: <strong>{baseAmount || '1000'} LKR</strong> (for reaching {minimumKgThreshold || '30'}kg threshold)</p>
                            <p>• Extra weight: <strong>{(35 - (parseFloat(minimumKgThreshold) || 30))}kg</strong> × {perKgRate || '15'} LKR = <strong>{((35 - (parseFloat(minimumKgThreshold) || 30)) * (parseFloat(perKgRate) || 15)).toFixed(2)} LKR</strong></p>
                            <p className="font-semibold text-green-900 pt-1 border-t border-green-200">
                                Total Salary: <strong>{(parseFloat(baseAmount || 1000) + ((35 - (parseFloat(minimumKgThreshold) || 30)) * (parseFloat(perKgRate) || 15))).toFixed(2)} LKR</strong>
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSaving}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="flex-1 px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isSaving ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Saving...
                                </span>
                            ) : 'Save Configuration'}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}

export default SalaryConfigModal;
