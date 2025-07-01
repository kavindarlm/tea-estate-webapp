import { PhotoIcon, UserCircleIcon, TrashIcon } from "@heroicons/react/24/solid";
import TeaWeightSummary from "../tea-weight/TeaWeightSummary";
import React, { useState } from "react"; // Import useState to manage component state

function AddNewTeaWeight() {
  const [isCancel, setIsCancel] = useState(false);
  const [date, setDate] = useState("");
  const [totalWeight, setTotalWeight] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [employeeWeight, setEmployeeWeight] = useState("");
  const [factoryName, setFactoryName] = useState("");
  const [factoryWeight, setFactoryWeight] = useState("");
  const [employeeWeights, setEmployeeWeights] = useState([]); // State to hold employee data
  const [factoryWeights, setFactoryWeights] = useState([]); // State to hold factory data

  const handleCancelClick = () => {
    setIsCancel(true);
  };

  const handleAddEmployeeClick = (e) => {
    e.preventDefault();
    setEmployeeWeights([...employeeWeights, { name: employeeName, weight: employeeWeight }]);
    setEmployeeName("");
    setEmployeeWeight("");
  };

  const handleAddFactoryClick = (e) => {
    e.preventDefault();
    setFactoryWeights([...factoryWeights, { name: factoryName, weight: factoryWeight }]);
    setFactoryName("");
    setFactoryWeight("");
  };

  const handleDeleteEmployeeClick = (index) => {
    setEmployeeWeights(employeeWeights.filter((_, i) => i !== index));
  };

  const handleDeleteFactoryClick = (index) => {
    setFactoryWeights(factoryWeights.filter((_, i) => i !== index));
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
                <input
                  type="text"
                  name="employeeName"
                  id="employeeName"
                  autoComplete="given-name"
                  placeholder="Employee Name"
                  value={employeeName}
                  onChange={(e) => setEmployeeName(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2"
                />
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
                <input
                  type="text"
                  name="factoryName"
                  id="factoryName"
                  autoComplete="given-name"
                  placeholder="Factory Name"
                  value={factoryName}
                  onChange={(e) => setFactoryName(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2"
                />
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
        >
          Save
        </button>
      </div>
    </form>
  );
}

export default AddNewTeaWeight;