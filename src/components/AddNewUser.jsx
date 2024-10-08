import { useState } from 'react';
import UserMamanagement from './UserManagement';

function AddNewUser() {
    const [isCancel, setIsCancel] = useState(false);

    const [userData, setUserData] = useState({
        user_name: '',
        user_email: '',
        user_address: '',
        user_phone: '',
        user_role: '',
        user_nic: '',
        user_age: '',
        user_sex: ''
    });

    const handleCancelClick = () => {
        setIsCancel(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData({
            ...userData,
            [name]: value
        });
    };

    const resetForm = () => {
        setUserData({
            user_name: '',
            user_email: '',
            user_address: '',
            user_phone: '',
            user_role: '',
            user_nic: '',
            user_age: '',
            user_sex: ''
        });
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const response = await fetch('http://localhost:3000/api/user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        });
        if (!response.ok) {
          if (response.status === 405) {
            console.error('Method Not Allowed. The server does not allow POST requests at this endpoint.');
            alert('Failed to create user. The server does not allow POST requests at this endpoint.');
          } else {
            console.error('Server responded with a non-2xx status:', response.status);
            alert('Failed to create user. Please check the server configuration.');
          }
          return;
        }
        // Handle success response
        resetForm();
      } catch (error) {
        console.error('Failed to create user:', error);
        alert('Failed to create user. Please check the server configuration.');
      }
    };

    if (isCancel) {
        return <UserMamanagement />;
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="space-y-12 px-4 sm:px-6 lg:px-8">
                <div className="border-b border-gray-900/10 pb-12">
                    <h2 className="text-base font-semibold leading-7 text-gray-900 text-lg">Add New User</h2>
                    <p className="mt-1 text-sm leading-6 text-gray-600">Enter New User information.</p>

                    <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">
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
                                    value={userData.user_name}
                                    onChange={handleInputChange}
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
                                    value={userData.user_email}
                                    onChange={handleInputChange}
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
                                    value={userData.user_phone}
                                    onChange={handleInputChange}
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
                                    value={userData.user_role}
                                    onChange={handleInputChange}
                                    name="user_role"
                                    id="user_role"
                                    autoComplete="Role"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2"
                                >
                                    <option value="" disabled>User role</option>
                                    <option value="Admin">Admin</option>
                                    <option value="User">User</option>
                                </select>
                            </div>
                        </div>

                        <div className="sm:col-span-3">
                            <label htmlFor="user_sex" className="block text-sm font-medium leading-6 text-gray-900">
                                Sex
                            </label>
                            <div className="mt-1">
                                <select
                                    value={userData.user_sex}
                                    onChange={handleInputChange}
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
                                    value={userData.user_age}
                                    onChange={handleInputChange}
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
                                    value={userData.user_nic}
                                    onChange={handleInputChange}
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
                                    value={userData.user_address}
                                    onChange={handleInputChange}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-4 flex items-center justify-end gap-x-6">
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

export default AddNewUser;