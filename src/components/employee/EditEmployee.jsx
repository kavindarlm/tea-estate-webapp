import React, { useEffect, useState } from 'react';

const EditEmployee = ({ employeeId, onClose }) => {
    const [employee, setEmployee] = useState({
        emp_name: '',
        emp_age: '',
        emp_sex: '',
        emp_nic: '',
        emp_address: ''
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (employeeId) {
            // Fetch employee data using the employeeId
            console.log('Fetching employee data for ID:', employeeId);
            fetchEmployeeData(employeeId);
        }
    }, [employeeId]);

    const fetchEmployeeData = async (id) => {
        try {
            // Replace with your actual data fetching logic
            const response = await fetch(`http://localhost:3000/api/employee/${id}`);
            const data = await response.json();
            setEmployee(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching employee data:', error);
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEmployee((prevEmployee) => ({
            ...prevEmployee,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Replace with your actual data update logic
            const response = await fetch(`http://localhost:3000/api/employee/${employeeId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(employee)
            });
            if (!response.ok) {
                console.error('Failed to update employee data:', response.status);
                return;
            }
            // alert('Employee data updated successfully');
            confirm('Do you want to close the modal?') && (onClose());
            onClose();
        } catch (error) {
            console.error('Error updating employee data:', error);
        }
    };

    const handleCancelClick = () => {
        onClose();
    };

    const handleDeleteClick = async () => {
        if (confirm('Are you sure you want to delete this factory?')) {
            try {
                // Replace with your actual data delete logic
                const response = await fetch(`http://localhost:3000/api/employee/${employeeId}`, {
                    method: 'DELETE'
                });
                if (!response.ok) {
                    console.error('Failed to delete employee data:', response.status);
                    return;
                }
                // alert('Employee data deleted successfully');
                onClose();
            } catch (error) {
                console.error('Error deleting employee data:', error);
            }
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <form className="space-y-8 px-4 sm:px-4 lg:px-8 sm:py-2 lg:py-4" onSubmit={handleSubmit}>
            <div className="border-b border-gray-900/10 pb-10">
                <h2 className="text-lg font-semibold leading-7 text-gray-900">Edit Employee Details</h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">Update employee personal information</p>

                <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
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
                                value={employee.emp_name}
                                onChange={handleChange}
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
                                value={employee.emp_age}
                                onChange={handleChange}
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
                                name="emp_sex"
                                id="emp_sex"
                                autoComplete="sex"
                                value={employee.emp_sex}
                                onChange={handleChange}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2"
                            >
                                <option value="" disabled>
                                    Sex
                                </option>
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
                                value={employee.emp_nic}
                                onChange={handleChange}
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
                                value={employee.emp_address}
                                onChange={handleChange}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-6 flex items-center justify-between gap-x-6">
                <button
                    type="button"
                    className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-buttonColor"
                    onClick={handleDeleteClick}
                >
                    Delete
                </button>
                <div className="flex items-center gap-x-6">
                    <button
                        type="button"
                        className="text-sm font-semibold leading-6 text-gray-900"
                        onClick={handleCancelClick}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="rounded-md bg-buttonColor px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-buttonColor"
                    >
                        Update
                    </button>
                </div>
            </div>
        </form>
    );
};

export default EditEmployee;