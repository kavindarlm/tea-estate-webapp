import React, { useEffect, useState } from 'react';

const EditUser = ({ userId, onClose }) => {
    const [user, setUser] = useState({
        user_name: '',
        user_email: '',
        user_address: '',
        user_phone: '',
        user_nic: '',
        user_role: '',
        user_age: '',
        user_sex: ''
    });
    const [isLoading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (userId) {
            console.log('Fetching employee data for ID:', userId);
            fetchUserData(userId);
        }
    }, [userId]);

    const fetchUserData = async (id) => {
        try {
            const response = await fetch(`http://localhost:3000/api/user/${id}`);
            if (!response.ok) {
                console.error('Failed to fetch user data:', response.status);
                return;
            }

            const data = await response.json();
            setUser(data);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch user data:', error);
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Replace with your actual data update logic
            const response = await fetch(`http://localhost:3000/api/user/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            });
            if (!response.ok) {
                console.error('Failed to update employee data:', response.status);
                return;
            }
            // alert('User data updated successfully');
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
        try {
            // Replace with your actual delete logic
            const response = await fetch(`http://localhost:3000/api/user/${userId}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                console.error('Failed to delete user:', response.status);
                return;
            }
            // alert('User deleted successfully');
            onClose();
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <form className="space-y-8 px-4 sm:px-4 lg:px-8 sm:py-2 lg:py-4" onSubmit={handleSubmit}>
            <div className="border-b border-gray-900/10 pb-10">
                <h2 className="text-lg font-semibold leading-7 text-gray-900">Edit User Details</h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">Update User personal information</p>

                <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
                    <div className="sm:col-span-full">
                        <label htmlFor="user_name" className="block text-sm font-medium leading-6 text-gray-900">
                            Full name
                        </label>
                        <div className="mt-1">
                            <input
                                type="text"
                                name="user_name"
                                id="user_name"
                                autoComplete="given-name"
                                placeholder='Full name'
                                value={user.user_name}
                                onChange={handleChange}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2"
                            />
                        </div>
                    </div>
                    <div className="sm:col-span-3">
                        <label htmlFor="user_email" className="block text-sm font-medium leading-6 text-gray-900">
                            Email
                        </label>
                        <div className="mt-1">
                            <input
                                type="text"
                                name="user_email"
                                id="user_email"
                                autoComplete="given-email"
                                placeholder='Email address'
                                value={user.user_email}
                                onChange={handleChange}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2"
                            />
                        </div>
                    </div>

                    <div className="sm:col-span-3">
                        <label htmlFor="user_phone" className="block text-sm font-medium leading-6 text-gray-900">
                            Phone Number
                        </label>
                        <div className="mt-1">
                            <input
                                type="number"
                                name="user_phone"
                                id="user_phone"
                                autoComplete="Phone Number"
                                placeholder='Phone Number'
                                value={user.user_phone}
                                onChange={handleChange}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2"
                            />
                        </div>
                    </div>

                    <div className="sm:col-span-3">
                        <label htmlFor="user_role" className="block text-sm font-medium leading-6 text-gray-900">
                            User Role
                        </label>
                        <div className="mt-1">
                            <select
                                value={user.user_role}
                                onChange={handleChange}
                                name="user_role"
                                id="user_role"
                                autoComplete="Role"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2"
                            >
                                <option value="" disabled>User role</option>
                                <option value="Male">Admin</option>
                                <option value="Female">User</option>
                            </select>
                        </div>
                    </div>

                    <div className="sm:col-span-3">
                        <label htmlFor="user_sex" className="block text-sm font-medium leading-6 text-gray-900">
                            Sex
                        </label>
                        <div className="mt-1">
                            <select
                                value={user.user_sex}
                                onChange={handleChange}
                                name="user_sex"
                                id="user_sex"
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
                        <label htmlFor="user_age" className="block text-sm font-medium leading-6 text-gray-900">
                            Age
                        </label>
                        <div className="mt-1">
                            <input
                                type="number"
                                name="user_age"
                                id="user_age"
                                autoComplete="age"
                                placeholder='Age'
                                value={user.user_age}
                                onChange={handleChange}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2"
                            />
                        </div>
                    </div>

                    <div className="sm:col-span-3">
                        <label htmlFor="user_nic" className="block text-sm font-medium leading-6 text-gray-900">
                            NIC Number
                        </label>
                        <div className="mt-1">
                            <input
                                type="text"
                                name="user_nic"
                                id="user_nic"
                                autoComplete="nic"
                                placeholder='NIC Number'
                                value={user.user_nic}
                                onChange={handleChange}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2"
                            />
                        </div>
                    </div>

                    <div className="col-span-full">
                        <label htmlFor="user_address" className="block text-sm font-medium leading-6 text-gray-900">
                            Address
                        </label>
                        <div className="mt-1">
                            <input
                                type="text"
                                name="user_address"
                                id="user_address"
                                autoComplete="address"
                                placeholder='Address'
                                value={user.user_address}
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

export default EditUser;

