import React, { useState } from 'react';
import axios from 'axios';

const ChangePassword = ({ onClose }) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem('user_id');
    try {
      const response = await axios.put(`/api/user/${userId}/password`, {
        oldPassword,
        newPassword,
        confirmPassword,
      });
      setSuccess(response.data.message);
      setError('');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      onClose();
    } catch (error) {
      setError(error.response.data.message);
      setSuccess('');
    }
  };

  return (
    <form className="space-y-8 px-4 sm:px-4 lg:px-8 sm:py-2 lg:py-4" onSubmit={handleSubmit}>
      <div className="border-b border-gray-900/10 pb-10">
        <h2 className="text-lg font-semibold leading-7 text-gray-900">Change Password</h2>
        <p className="mt-1 text-sm leading-6 text-gray-600">Change your current password</p>

        <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
          <div className="sm:col-span-full">
            <label htmlFor="old-password" className="block text-sm font-medium leading-6 text-gray-900">
              Old Password
            </label>
            <div className="mt-2 relative">
              <input
                id="old-password"
                name="old-password"
                type={showOldPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6 text-black"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                onClick={() => setShowOldPassword(!showOldPassword)}
              >
                {showOldPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <div className="sm:col-span-full">
            <label htmlFor="new-password" className="block text-sm font-medium leading-6 text-gray-900">
              New Password
            </label>
            <div className="mt-2 relative">
              <input
                id="new-password"
                name="new-password"
                type={showNewPassword ? 'text' : 'password'}
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6 text-black"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <div className="sm:col-span-full">
            <label htmlFor="confirm-password" className="block text-sm font-medium leading-6 text-gray-900">
              Confirm Password
            </label>
            <div className="mt-2 relative">
              <input
                id="confirm-password"
                name="confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6 text-black"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between gap-x-6">
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
        <div className="flex items-center gap-x-6">
          <button
            type="button"
            onClick={onClose}
            className="text-sm font-semibold leading-6 text-gray-900"
          >
            Close
          </button>
          <button
            type="submit"
            className="rounded-md bg-buttonColor px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-buttonColor"
          >
            Change Password
          </button>
        </div>
      </div>
    </form>
  );
};

export default ChangePassword;