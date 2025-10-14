import { useState, useEffect } from "react";
import UserManagement from "../user/UserManagement";
import { useToast } from "../reusable/Toaster";
import { apiRequest } from "@/utils/api";

function EditUser({ userId, onClose }) {
  const [isCancel, setIsCancel] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [availablePermissions, setAvailablePermissions] = useState([]);
  const { showSuccess, showError, showWarning } = useToast();

  const [userData, setUserData] = useState({
    user_name: "",
    user_email: "",
    user_address: "",
    user_phone: "",
    user_role: "",
    user_nic: "",
    user_age: "",
    user_sex: "",
  });

  const [userPermissions, setUserPermissions] = useState({});
  const [errors, setErrors] = useState({});

  // Fetch available permissions from API
  useEffect(() => {
    if (userId) {
      console.log('Fetching user data for ID:', userId);
      fetchPermissions().then(() => {
        fetchUserData(userId);
      });
    }
  }, [userId]);

  const fetchPermissions = async () => {
    try {
      console.log('Fetching available permissions...');
      const response = await fetch("/api/system-features?type=all");
      const data = await response.json();

      if (data.success) {
        const permissionMap = {
          Dashboard: "dashboard",
          "Tea Weight": "teaWeightManagement",
          "Employees List": "employeeListManagement",
          "Factory List": "factoryListManagement",
          Reports: "reportsManagement",
          Calendar: "calendarManagement",
          Salary: "salaryManagement",
          "Tea Health": "teaHealthManagement",
          "User Management": "userManagement",
        };

        const permissions = data.data.map((feature) => ({
          id: permissionMap[feature.name] || feature.name.toLowerCase().replace(/\s+/g, ""),
          label: feature.name,
          systemFeatureId: feature.system_feature_id,
        }));

        console.log('Available permissions loaded:', permissions);
        setAvailablePermissions(permissions);

        const initialPermissions = permissions.reduce((acc, permission) => {
          acc[permission.id] = false;
          return acc;
        }, {});
        console.log('Initialized permissions to false:', initialPermissions);
        setUserPermissions(initialPermissions);
      }
    } catch (error) {
      console.error("Error fetching permissions:", error);
    }
  };

  const fetchUserData = async (id) => {
    try {
      const response = await apiRequest(`/api/user/${id}`);
      if (!response.ok) {
        console.error('Failed to fetch user data:', response.status);
        return;
      }

      const data = await response.json();
      setUserData(data);

      // Fetch user's current permissions if user role is 'User'
      if (data.user_role === 'User') {
        try {
          const permResponse = await apiRequest(`/api/user-system-features?userId=${id}`);
          if (permResponse.ok) {
            const permData = await permResponse.json();
            console.log('Fetched user permissions response:', permData);
            if (permData.success && permData.data) {
              const grantedPermissions = {};
              const permissionMap = {
                'Dashboard': 'dashboard',
                'Tea Weight': 'teaWeightManagement',
                'Employees List': 'employeeListManagement',
                'Factory List': 'factoryListManagement',
                'Reports': 'reportsManagement',
                'Calendar': 'calendarManagement',
                'Salary': 'salaryManagement',
                'Tea Health': 'teaHealthManagement',
                'User Management': 'userManagement'
              };

              permData.data.forEach(feature => {
                const permId = permissionMap[feature.name];
                if (permId) {
                  grantedPermissions[permId] = true;
                }
              });

              console.log('Mapped granted permissions:', grantedPermissions);
              
              setUserPermissions(prev => {
                const updated = {
                  ...prev,
                  ...grantedPermissions
                };
                console.log('Updated userPermissions:', updated);
                return updated;
              });
            }
          } else {
            console.error('Failed to fetch permissions:', permResponse.status);
          }
        } catch (permError) {
          console.error('Error fetching user permissions:', permError);
        }
      } else {
        console.log('User role is not "User", skipping permission fetch');
      }

      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      setLoading(false);
    }
  };

  const handleCancelClick = () => {
    setIsCancel(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
    
    // Reset permissions when changing from User to Admin
    if (name === 'user_role' && value === 'Admin') {
      const resetPermissions = {};
      availablePermissions.forEach(permission => {
        resetPermissions[permission.id] = false;
      });
      setUserPermissions(resetPermissions);
    }
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const handlePermissionChange = (e) => {
    const { name, checked } = e.target;
    setUserPermissions({
      ...userPermissions,
      [name]: checked,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate permissions for User role
    if (userData.user_role === "User") {
      const hasAnyPermission = Object.values(userPermissions).some(permission => permission === true);
      if (!hasAnyPermission) {
        showWarning("Please grant at least one permission to the user");
        return;
      }
    }

    try {
      // Include permissions in the update payload
      const updatePayload = {
        ...userData,
        permissions: userPermissions
      };

      const response = await apiRequest(`/api/user/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatePayload)
      });
      if (!response.ok) {
        console.error('Failed to update user data:', response.status);
        showError('Failed to update user. Please try again.');
        return;
      }
      showSuccess(`User "${userData.user_name}" updated successfully!`);
      setIsCancel(true);
    } catch (error) {
      console.error('Error updating user data:', error);
      showError('Error updating user. Please try again.');
    }
  };

  const handleDeleteClick = async () => {
    if (!confirm('Are you sure you want to delete this user?')) {
      return;
    }
    
    try {
      const response = await apiRequest(`/api/user/${userId}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        console.error('Failed to delete user:', response.status);
        showError('Failed to delete user. Please try again.');
        return;
      }
      showSuccess(`User "${userData.user_name}" deleted successfully`);
      setIsCancel(true);
    } catch (error) {
      console.error('Error deleting user:', error);
      showError('Error deleting user. Please try again.');
    }
  };

  if (isCancel) {
    return <UserManagement />;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-12 px-4 sm:px-6 lg:px-8">
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="font-semibold leading-7 text-gray-900 text-lg">
            Edit {userData.user_name ? `${userData.user_name}'s` : 'User'} Details
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Update User personal information
          </p>

          <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">
            <div className="sm:col-span-full">
              <label
                htmlFor="user_name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Full name
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="user_name"
                  id="user_name"
                  autoComplete="given-name"
                  placeholder="Full name"
                  value={userData.user_name}
                  onChange={handleInputChange}
                  className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ${
                    errors.user_name ? "ring-red-500" : "ring-gray-300"
                  } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2`}
                />
                {errors.user_name && (
                  <p className="mt-1 text-sm text-red-600">{errors.user_name}</p>
                )}
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="user_email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="user_email"
                  id="user_email"
                  autoComplete="given-email"
                  placeholder="Email address"
                  value={userData.user_email}
                  onChange={handleInputChange}
                  className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ${
                    errors.user_email ? "ring-red-500" : "ring-gray-300"
                  } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2`}
                />
                {errors.user_email && (
                  <p className="mt-1 text-sm text-red-600">{errors.user_email}</p>
                )}
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="user_phone"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Phone Number
              </label>
              <div className="mt-1">
                <input
                  type="number"
                  name="user_phone"
                  id="user_phone"
                  autoComplete="Phone Number"
                  placeholder="Phone Number"
                  value={userData.user_phone}
                  onChange={handleInputChange}
                  className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ${
                    errors.user_phone ? "ring-red-500" : "ring-gray-300"
                  } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2`}
                />
                {errors.user_phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.user_phone}</p>
                )}
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="user_sex"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Sex
              </label>
              <div className="mt-1">
                <select
                  value={userData.user_sex}
                  onChange={handleInputChange}
                  name="user_sex"
                  id="user_sex"
                  autoComplete="sex"
                  className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ${
                    errors.user_sex ? "ring-red-500" : "ring-gray-300"
                  } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2`}
                >
                  <option value="" disabled>
                    Sex
                  </option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
                {errors.user_sex && (
                  <p className="mt-1 text-sm text-red-600">{errors.user_sex}</p>
                )}
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="user_age"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Age
              </label>
              <div className="mt-1">
                <input
                  type="number"
                  name="user_age"
                  id="user_age"
                  autoComplete="age"
                  placeholder="Age"
                  value={userData.user_age}
                  onChange={handleInputChange}
                  className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ${
                    errors.user_age ? "ring-red-500" : "ring-gray-300"
                  } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2`}
                />
                {errors.user_age && (
                  <p className="mt-1 text-sm text-red-600">{errors.user_age}</p>
                )}
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="user_nic"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                NIC Number
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="user_nic"
                  id="user_nic"
                  autoComplete="nic"
                  placeholder="NIC Number"
                  value={userData.user_nic}
                  onChange={handleInputChange}
                  className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ${
                    errors.user_nic ? "ring-red-500" : "ring-gray-300"
                  } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2`}
                />
                {errors.user_nic && (
                  <p className="mt-1 text-sm text-red-600">{errors.user_nic}</p>
                )}
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="user_address"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Address
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="user_address"
                  id="user_address"
                  autoComplete="address"
                  placeholder="Address"
                  value={userData.user_address}
                  onChange={handleInputChange}
                  className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ${
                    errors.user_address ? "ring-red-500" : "ring-gray-300"
                  } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2`}
                />
                {errors.user_address && (
                  <p className="mt-1 text-sm text-red-600">{errors.user_address}</p>
                )}
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="user_role"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                User Role
              </label>
              <div className="mt-1">
                <select
                  value={userData.user_role}
                  onChange={handleInputChange}
                  name="user_role"
                  id="user_role"
                  autoComplete="Role"
                  className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ${
                    errors.user_role ? "ring-red-500" : "ring-gray-300"
                  } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2`}
                >
                  <option value="" disabled>
                    User role
                  </option>
                  <option value="Admin">Admin</option>
                  <option value="User">User</option>
                </select>
                {errors.user_role && (
                  <p className="mt-1 text-sm text-red-600">{errors.user_role}</p>
                )}
              </div>
            </div>

            {userData.user_role === "User" && (
              <div className="sm:col-span-full mt-8">
                <div className="border-t border-gray-200 pt-8">
                  <h3 className="text-lg font-semibold leading-6 text-gray-900">
                    User permission
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">
                    Grant system features to this user
                  </p>

                  <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                    {availablePermissions.map((permission) => (
                      <div
                        key={permission.id}
                        className="flex items-center justify-between"
                      >
                        <label
                          htmlFor={permission.id}
                          className="block text-sm font-medium text-gray-900"
                        >
                          {permission.label}
                        </label>
                        <div className="flex items-center">
                          <span className="text-sm text-white bg-green-600 px-2 py-1 rounded">
                            {userPermissions[permission.id]
                              ? "Granted"
                              : "Grant"}
                          </span>
                          <input
                            id={permission.id}
                            name={permission.id}
                            type="checkbox"
                            checked={userPermissions[permission.id] || false}
                            onChange={handlePermissionChange}
                            className="ml-2 h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-600"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  {errors.permissions && (
                    <p className="mt-2 text-sm text-red-600">{errors.permissions}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between gap-x-6 px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
          onClick={handleDeleteClick}
        >
          Delete
        </button>
        <div className="flex items-center gap-x-4">
          <button
            type="button"
            className="text-sm font-semibold leading-6 text-gray-900"
            onClick={handleCancelClick}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
          >
            Update
          </button>
        </div>
      </div>
    </form>
  );
}

export default EditUser;
