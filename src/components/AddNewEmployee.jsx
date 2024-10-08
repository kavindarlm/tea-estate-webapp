import { useState } from 'react';
import EmployeeList from './EmployeeList';

function AddNewEmployee() {
    const [isCancel, setIsCancel] = useState(false);

    const [employeeData, setEmployeeData] = useState({
        emp_name: '',
        emp_age: '',
        emp_sex: '',
        emp_address: '',
        emp_nic: ''
    });

    const handleCancelClick = () => {
        setIsCancel(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEmployeeData({
            ...employeeData,
            [name]: value
        });
    };

    const resetForm = () => {
        setEmployeeData({
            emp_name: '',
            emp_age: '',
            emp_sex: '',
            emp_address: '',
            emp_nic: ''
        });
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const response = await fetch('http://localhost:3000/api/employee', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(employeeData),
        });
        if (!response.ok) {
          if (response.status === 405) {
            console.error('Method Not Allowed. The server does not allow POST requests at this endpoint.');
            alert('Failed to create employee. The server does not allow POST requests at this endpoint.');
          } else {
            console.error('Server responded with a non-2xx status:', response.status);
            alert('Failed to create employee. Please check the server configuration.');
          }
          return;
        }
        // Handle success response
        resetForm();
      } catch (error) {
        console.error('Error adding employee:', error);
        alert('Error adding employee. Please check your network connection and server status.');
      }
    };

    if (isCancel) {
        return <EmployeeList />;
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="space-y-12 px-4 sm:px-6 lg:px-8">
                <div className="border-b border-gray-900/10 pb-12">
                    <h2 className="text-base font-semibold leading-7 text-gray-900 text-lg">Add New Employee</h2>
                    <p className="mt-1 text-sm leading-6 text-gray-600">Enter new employee personal information</p>

                    <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <div className="sm:col-span-full">
                            <label htmlFor="emp_name" className="block text-sm font-medium leading-6 text-gray-900">
                                Full name
                            </label>
                            <div className="mt-1">
                                <input
                                    type="text"
                                    name="emp_name"
                                    id="emp_name"
                                    autoComplete="given-name"
                                    placeholder='Full name'
                                    value={employeeData.emp_name}
                                    onChange={handleInputChange}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2"
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-3">
                            <label htmlFor="emp_age" className="block text-sm font-medium leading-6 text-gray-900">
                                Age
                            </label>
                            <div className="mt-1">
                                <input
                                    type="number"
                                    name="emp_age"
                                    id="emp_age"
                                    autoComplete="age"
                                    placeholder='Age'
                                    value={employeeData.emp_age}
                                    onChange={handleInputChange}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2"
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-3">
                            <label htmlFor="emp_sex" className="block text-sm font-medium leading-6 text-gray-900">
                                Sex
                            </label>
                            <div className="mt-1">
                                <select
                                    value={employeeData.emp_sex}
                                    onChange={handleInputChange}
                                    name="emp_sex"
                                    id="emp_sex"
                                    autoComplete="sex"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2"
                                >
                                    <option value="" disabled>Sex</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            </div>
                        </div>

                        <div className="sm:col-span-3">
                            <label htmlFor="emp_nic" className="block text-sm font-medium leading-6 text-gray-900">
                                NIC Number
                            </label>
                            <div className="mt-1">
                                <input
                                    type="text"
                                    name="emp_nic"
                                    id="emp_nic"
                                    autoComplete="nic"
                                    placeholder='NIC Number'
                                    value={employeeData.emp_nic}
                                    onChange={handleInputChange}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2"
                                />
                            </div>
                        </div>

                        <div className="col-span-full">
                            <label htmlFor="emp_address" className="block text-sm font-medium leading-6 text-gray-900">
                                Address
                            </label>
                            <div className="mt-1">
                                <input
                                    type="text"
                                    name="emp_address"
                                    id="emp_address"
                                    autoComplete="address"
                                    placeholder='Address'
                                    value={employeeData.emp_address}
                                    onChange={handleInputChange}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-x-6">
                <button type="button" className="text-sm font-semibold leading-6 text-gray-900" onClick={handleCancelClick}>
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

export default AddNewEmployee;
