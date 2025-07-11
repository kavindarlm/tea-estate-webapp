import React, { useEffect, useState } from 'react';
import Header from '../reusable/Header';
import Pagination from '../reusable/Pagination';
import Modal from '../Modal';
import AddNewUser from '../user/AddNewUser';
import EditUser from '../user/EditUser';

function UserMamanagement() {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAddingUser, setIsAddingUser] = useState(false);
    const [currentPage, setCCurrentPage] = useState(1);
    const usersPerPage = 6;
    const [totalPages, setTotalPages] = useState(1);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, [currentPage, usersPerPage]);

    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/user');
            if (!response.ok) {
                console.error('Failed to fetch user data:', response.status);
                return;
            }

            const data = await response.json();
            const startIndex = (currentPage - 1) * usersPerPage;
            const endIndex = startIndex + usersPerPage;
            setUsers(data.slice(startIndex, endIndex));
            setTotalPages(Math.ceil(data.length / usersPerPage));
            setIsLoading(false);
        } catch (error) {
            console.error('Failed to fetch user data:', error);
            setIsLoading(false);
        }
    };

    const handleAddUserClick = () => {
        setIsAddingUser(true);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleEditClick = (id) => {
        setSelectedUserId(id);
        setIsEditModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsEditModalOpen(false);
        setSelectedUserId(null);
        fetchUsers();
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isAddingUser) {
        return <AddNewUser />;
    }

    return (
        <div className="px-4 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-lg font-semibold leading-6 text-gray-900">User Management</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        Manage all the Estate Managers in your Tea Estate.
                    </p>
                </div>
                <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                    <button
                        type="button"
                        className="block rounded-md bg-buttonColor px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-green-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                        onClick={handleAddUserClick}
                    >
                        Add User
                    </button>
                </div>
            </div>
            <div className={`mt-4 flow-root ${isEditModalOpen ? 'blur-sm' : ''}`}>
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        <table className="min-w-full divide-y divide-gray-300">
                            <thead>
                                <tr>
                                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3">
                                        Name
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                        Email
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                        Address
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                        Phone No.
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                        Role
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
                                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-3">
                                        <span className="sr-only">Edit</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white">
                                {users.map((user) => (
                                    <tr key={user.user_id}>
                                        <td className="pl-4 pr-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900 sm:pl-3">
                                            {user.user_name}
                                        </td>
                                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {user.user_email}
                                        </td>
                                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {user.user_address}
                                        </td>
                                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {user.user_phone}
                                        </td>
                                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {user.user_role}
                                        </td>
                                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {user.user_nic}
                                        </td>
                                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {user.user_age}
                                        </td>
                                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {user.user_sex}
                                        </td>
                                        <td className="pr-3 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <a
                                                href="#"
                                                onClick={() => handleEditClick(user.user_id)}
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
                <EditUser userId={selectedUserId} onClose={handleCloseModal} />
            </Modal>
        </div>
    );
}

export default UserMamanagement;