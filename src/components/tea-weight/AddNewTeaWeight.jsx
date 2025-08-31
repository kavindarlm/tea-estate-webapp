import { PhotoIcon, UserCircleIcon, TrashIcon } from "@heroicons/react/24/solid";
import TeaWeightSummary from "../tea-weight/TeaWeightSummary";
import React, { useState, useEffect } from "react"; // Import useState and useEffect to manage component state

function AddNewTeaWeight() {
  const [isCancel, setIsCancel] = useState(false);
  const [date, setDate] = useState("");
  const [totalWeight, setTotalWeight] = useState("");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [employeeWeight, setEmployeeWeight] = useState("");
  const [selectedFactoryId, setSelectedFactoryId] = useState("");
  const [factoryWeight, setFactoryWeight] = useState("");
  const [employeeWeights, setEmployeeWeights] = useState([]); // State to hold employee data
  const [factoryWeights, setFactoryWeights] = useState([]); // State to hold factory data
  const [employees, setEmployees] = useState([]); // State to hold all employees
  const [factories, setFactories] = useState([]); // State to hold all factories

  useEffect(() => {
    fetchEmployees();
    fetchFactories();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/employee');
      if (!response.ok) {
        console.error('Failed to fetch employees:', response.status);
        return;
      }
      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      console.error('Failed to fetch employees:', error);
    }
  };

  const fetchFactories = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/factory');
      if (!response.ok) {
        console.error('Failed to fetch factories:', response.status);
        return;
      }
      const data = await response.json();
      setFactories(data);
    } catch (error) {
      console.error('Failed to fetch factories:', error);
    }
  };

  const handleCancelClick = () => {
    setIsCancel(true);
  };

  const handleAddEmployeeClick = (e) => {
    e.preventDefault();
    if (!selectedEmployeeId || !employeeWeight) {
      alert('Please select an employee and enter weight');
      return;
    }
    const selectedEmployee = employees.find(emp => emp.emp_id == selectedEmployeeId);
    if (selectedEmployee) {
      setEmployeeWeights([...employeeWeights, { 
        id: selectedEmployee.emp_id,
        name: selectedEmployee.emp_name, 
        weight: employeeWeight 
      }]);
      setSelectedEmployeeId("");
      setEmployeeWeight("");
    }
  };

  const handleAddFactoryClick = (e) => {
    e.preventDefault();
    if (!selectedFactoryId || !factoryWeight) {
      alert('Please select a factory and enter weight');
      return;
    }
    const selectedFactory = factories.find(fac => fac.fac_id == selectedFactoryId);
    if (selectedFactory) {
      setFactoryWeights([...factoryWeights, { 
        id: selectedFactory.fac_id,
        name: selectedFactory.fac_name, 
        weight: factoryWeight 
      }]);
      setSelectedFactoryId("");
      setFactoryWeight("");
    }
  };

  const handleDeleteEmployeeClick = (index) => {
    setEmployeeWeights(employeeWeights.filter((_, i) => i !== index));
  };

  const handleDeleteFactoryClick = (index) => {
    setFactoryWeights(factoryWeights.filter((_, i) => i !== index));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    if (!date || !totalWeight) {
      alert('Please enter date and total weight');
      return;
    }

    if (employeeWeights.length === 0 && factoryWeights.length === 0) {
      alert('Please add at least one employee or factory weight');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/teaWeight', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date,
          totalWeight: parseFloat(totalWeight),
          employeeWeights,
          factoryWeights,
          createdBy: 1 // You can get this from user context/session
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save tea weight');
      }

      const result = await response.json();
      alert('Tea weight data saved successfully!');
      
      // Reset form
      setDate("");
      setTotalWeight("");
      setEmployeeWeights([]);
      setFactoryWeights([]);
      setSelectedEmployeeId("");
      setSelectedFactoryId("");
      setEmployeeWeight("");
      setFactoryWeight("");
      
      // Optionally redirect back to summary
      setIsCancel(true);
    } catch (error) {
      console.error('Failed to save tea weight:', error);
      alert('Failed to save tea weight: ' + error.message);
    }
  };

  if (isCancel) {
    return <TeaWeightSummary />;
  }

  return (
    <form>
      <div className="space-y-12 px-4 sm:px-6 lg:px-8">
        <div className="border-b border-gray-900/10 pb-20">
          <h2 className="font-semibold leading-7 text-gray-900 text-lg">
            Add New Weight
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Enter new total weight of date wise
          </p>

          <div className="mt-12 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label
                htmlFor="date"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Date
              </label>
              <div className="mt-3">
                <input
                  type="date"
                  name="date"
                  id="date"
                  autoComplete="off"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="totalWeight"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Total Weight (kg)
              </label>
              <div className="mt-3">
                <input
                  type="number"
                  name="totalWeight"
                  id="totalWeight"
                  autoComplete="off"
                  placeholder="Total Weight (kg)"
                  value={totalWeight}
                  onChange={(e) => setTotalWeight(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="employeeName"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Employee
              </label>
              <div className="mt-3">
                <select
                  name="employeeName"
                  id="employeeName"
                  value={selectedEmployeeId}
                  onChange={(e) => setSelectedEmployeeId(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2"
                >
                  <option value="">Select an employee</option>
                  {employees.map((employee) => (
                    <option key={employee.emp_id} value={employee.emp_id}>
                      {employee.emp_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="employeeWeight"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Employee weight
              </label>
              <div className="mt-3">
                <input
                  type="number"
                  name="employeeWeight"
                  id="employeeWeight"
                  autoComplete="off"
                  placeholder="Employee Weight (kg)"
                  value={employeeWeight}
                  onChange={(e) => setEmployeeWeight(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2"
                />
              </div>
            </div>
            <div className="sm:col-span-6 flex justify-end items-center">
              <button
                type="button"
                className="rounded-md bg-green-500 px-6 py-2 text-sm font-semibold text-black shadow-sm hover:bg-green-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                onClick={handleAddEmployeeClick}
              >
                Add Employee
              </button>
            </div>

            <div className="sm:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {employeeWeights.map((employee, index) => (
                <div key={index} className="border rounded-md p-4 shadow-sm flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Name: {employee.name}</p>
                    <p className="text-sm text-gray-600">Weight: {employee.weight} kg</p>
                  </div>
                  <button
                    type="button"
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleDeleteEmployeeClick(index)}
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="factoryName"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Factory
              </label>
              <div className="mt-3">
                <select
                  name="factoryName"
                  id="factoryName"
                  value={selectedFactoryId}
                  onChange={(e) => setSelectedFactoryId(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2"
                >
                  <option value="">Select a factory</option>
                  {factories.map((factory) => (
                    <option key={factory.fac_id} value={factory.fac_id}>
                      {factory.fac_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="factoryWeight"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Factory weight
              </label>
              <div className="mt-3">
                <input
                  type="number"
                  name="factoryWeight"
                  id="factoryWeight"
                  autoComplete="off"
                  placeholder="Factory Weight (kg)"
                  value={factoryWeight}
                  onChange={(e) => setFactoryWeight(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2"
                />
              </div>
            </div>
            <div className="sm:col-span-6 flex justify-end items-center">
              <button
                type="button"
                className="rounded-md bg-green-500 px-6 py-2 text-sm font-semibold text-black shadow-sm hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                onClick={handleAddFactoryClick}
              >
                Add Factory
              </button>
            </div>

            <div className="sm:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {factoryWeights.map((factory, index) => (
                <div key={index} className="border rounded-md p-4 shadow-sm flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Name: {factory.name}</p>
                    <p className="text-sm text-gray-600">Weight: {factory.weight} kg</p>
                  </div>
                  <button
                    type="button"
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleDeleteFactoryClick(index)}
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button
          type="button"
          className="text-sm font-semibold leading-6 text-gray-900"
          onClick={handleCancelClick}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-md bg-green-500 px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-green-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
          onClick={handleSave}
        >
          Save
        </button>
      </div>
    </form>
  );
}

export default AddNewTeaWeight;