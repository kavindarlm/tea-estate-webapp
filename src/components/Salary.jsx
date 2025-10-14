import React, { useState, useEffect } from "react";
import Header from "./reusable/Header";
import Modal from "./Modal";
import SalaryConfigModal from "./SalaryConfigModal";
import { apiRequest } from "@/utils/api";

function Salary() {
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [salaryData, setSalaryData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [salaryConfig, setSalaryConfig] = useState(null);

  useEffect(() => {
    fetchSalaryConfig();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      calculateSalaries();
    }
  }, [selectedDate]);

  const fetchSalaryConfig = async () => {
    try {
      const response = await apiRequest('/api/salary/config?active=true');
      if (response.ok) {
        const config = await response.json();
        setSalaryConfig(config);
      }
    } catch (error) {
      console.error('Failed to fetch salary config:', error);
    }
  };

  const calculateSalaries = async () => {
    try {
      setIsLoading(true);
      const response = await apiRequest(`/api/salary/calculate?date=${selectedDate}`);
      if (response.ok) {
        const data = await response.json();
        setSalaryData(data);
      } else {
        console.error('Failed to calculate salaries');
        setSalaryData([]);
      }
    } catch (error) {
      console.error('Failed to calculate salaries:', error);
      setSalaryData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfigUpdate = () => {
    setIsConfigModalOpen(true);
  };

  const handleModalClose = () => {
    setIsConfigModalOpen(false);
    fetchSalaryConfig(); // Refresh config after modal closes
    if (selectedDate) {
      calculateSalaries(); // Recalculate with new config
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div id="salary" className="flex-1 overflow-auto">
      <div className="py-5">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-lg font-semibold leading-6 text-gray-900">
                Employees Salary
              </h1>
              <p className="mt-2 text-sm text-gray-700">
                Calculate and view employee salaries based on daily tea weight collection.
              </p>
            </div>
            <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
              <button
                type="button"
                onClick={handleConfigUpdate}
                className="block rounded-md bg-buttonColor px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-green-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
              >
                Update salary config
              </button>
            </div>
          </div>

          {/* Salary Configuration Display */}
          {salaryConfig && (
            <div className="mt-6 bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Current Salary Configuration</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-900">Base Amount:</span> 
                  <span className="ml-2 text-gray-700">{formatCurrency(salaryConfig.base_amount)}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-900">Minimum Threshold:</span> 
                  <span className="ml-2 text-gray-700">{salaryConfig.minimum_kg_threshold} kg</span>
                </div>
                <div>
                  <span className="font-medium text-gray-900">Per Kg Rate:</span> 
                  <span className="ml-2 text-gray-700">{formatCurrency(salaryConfig.per_kg_rate)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Date Selection */}
          <div className="mt-6 bg-gray-50 p-4 rounded-lg">
            <label htmlFor="salaryDate" className="block text-sm font-medium text-gray-700 mb-2">
              Select Date for Salary Calculation
            </label>
            <input
              type="date"
              id="salaryDate"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full p-2 rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-sm text-black max-w-xs"
            />
          </div>

          {/* Salary Table */}
          <div className={`mt-8 flow-root ${isConfigModalOpen ? 'blur-sm' : ''}`}>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="text-gray-500">Calculating salaries...</div>
              </div>
            ) : (
              <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead>
                      <tr>
                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3">
                          Employee
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Daily Weight (kg)
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Base Amount
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Exceeded Weight
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Extra Amount
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Total Salary
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      {salaryData.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="px-6 py-8 text-center text-sm text-gray-500">
                            {selectedDate ? 'No salary data available for selected date' : 'Please select a date to calculate salaries'}
                          </td>
                        </tr>
                      ) : (
                        salaryData.map((item) => (
                          <tr key={item.employee.emp_id}>
                            <td className="pl-4 pr-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900 sm:pl-3">
                              {item.employee.emp_name}
                            </td>
                            <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                              {item.totalWeight.toFixed(2)}
                            </td>
                            <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                              {item.totalWeight >= item.threshold ? formatCurrency(item.baseAmount) : formatCurrency(0)}
                            </td>
                            <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                              {item.exceededWeight.toFixed(2)} kg
                            </td>
                            <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatCurrency(item.exceededWeight * item.perKgRate)}
                            </td>
                            <td className="px-3 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                              {formatCurrency(item.salary)}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                  {salaryData.length > 0 && (
                    <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-gray-900">
                          Total Daily Payroll:
                        </span>
                        <span className="text-lg font-bold text-green-600">
                          {formatCurrency(salaryData.reduce((sum, item) => sum + item.salary, 0))}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal isOpen={isConfigModalOpen} onClose={handleModalClose}>
        <SalaryConfigModal onClose={handleModalClose} />
      </Modal>
    </div>
  );
}

export default Salary;
