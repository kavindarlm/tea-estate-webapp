import React, { useEffect, useState } from 'react';
import Pagination from '../reusable/pagination'; // Assuming you have a reusable Pagination component
import AddNewEmployee from '../employee/AddNewEmployee'; // Assuming you have a component to add a new employee
import Modal from '../Modal'; // Import the Modal component
import EditEmployee from '../employee/EditEmployee'; // Import the EditEmployee component

function EmployeeList() {
    const [employees, setEmployees] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAddingEmployee, setIsAddingEmployee] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const employeesPerPage = 7;
    const [totalPages, setTotalPages] = useState(1);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);

    useEffect(() => {
        fetchEmployees();
    }, [currentPage, employeesPerPage]);

    const fetchEmployees = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/employee/weight');
            if (!response.ok) {
                console.error('Failed to fetch employee data:', response.status);
                return;
            }

            const data = await response.json();
            const startIndex = (currentPage - 1) * employeesPerPage;
            const endIndex = startIndex + employeesPerPage;
            setEmployees(data.slice(startIndex, endIndex));
            setTotalPages(Math.ceil(data.length / employeesPerPage));
            setIsLoading(false);
        } catch (error) {
            console.error('Failed to fetch employee data:', error);
            setIsLoading(false);
        }
    };

    const handleAddEmployeeClick = () => {
        setIsAddingEmployee(true);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleEditClick = (id) => {
        setSelectedEmployeeId(id);
        setIsEditModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsEditModalOpen(false);
        setSelectedEmployeeId(null);
        fetchEmployees();
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isAddingEmployee) {
        return <AddNewEmployee />;
    }

    return (
        <div className="px-4 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-lg font-semibold leading-6 text-gray-900">Employees</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        A list of all the employees in your estate including their name, address, total weight, and more.
                    </p>
                </div>
                <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                    <button
                        type="button"
                        className="block rounded-md bg-buttonColor px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-green-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                        onClick={handleAddEmployeeClick}
                    >
                        Add Employee
                    </button>
                </div>
            </div>
            <div className={`mt-8 flow-root ${isEditModalOpen ? 'blur-sm' : ''}`}>
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        <table className="min-w-full divide-y divide-gray-300">
                            <thead>
                                <tr>
                                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3">
                                        Name
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                        Address
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                        NIC
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                        Age
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                        Sex
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                        Total Weight (Kg)
                                    </th>
                                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-3">
                                        <span className="sr-only">Edit</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white">
                                {employees.map((employee) => (
                                    <tr key={employee.emp_id}>
                                        <td className="pl-4 pr-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900 sm:pl-3">
                                            {employee.emp_name}
                                        </td>
                                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {employee.emp_address}
                                        </td>
                                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {employee.emp_nic}
                                        </td>
                                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {employee.emp_age}
                                        </td>
                                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {employee.emp_sex}
                                        </td>
                                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {employee.total_weight}
                                        </td>
                                        <td className="pr-3 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <a
                                                href="#"
                                                onClick={() => handleEditClick(employee.emp_id)}
                                                className="text-green-500 hover:text-green-600"
                                            >
                                                Edit
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
            <Modal isOpen={isEditModalOpen} onClose={handleCloseModal}>
                <EditEmployee employeeId={selectedEmployeeId} onClose={handleCloseModal} />
            </Modal>
        </div>
    );
}

export default EmployeeList;