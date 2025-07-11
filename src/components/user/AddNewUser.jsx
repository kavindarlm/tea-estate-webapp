import { useState, useEffect } from "react";
import UserMamanagement from "../user/UserManagement";

function AddNewUser() {
  const [isCancel, setIsCancel] = useState(false);
  const [availablePermissions, setAvailablePermissions] = useState([]);

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

  // Fetch available permissions from API
  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const response = await fetch("/api/system-features?type=all");
        const data = await response.json();

        if (data.success) {
          // Convert system features to the format expected by the form
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
            id:
              permissionMap[feature.name] ||
              feature.name.toLowerCase().replace(/\s+/g, ""),
            label: feature.name,
            systemFeatureId: feature.system_feature_id,
          }));

          setAvailablePermissions(permissions);

          // Initialize permissions state
          const initialPermissions = permissions.reduce((acc, permission) => {
            acc[permission.id] = false;
            return acc;
          }, {});
          setUserPermissions(initialPermissions);
        }
      } catch (error) {
        console.error("Error fetching permissions:", error);
        alert("Failed to fetch permissions. Please try again later.");
      }
    };

    fetchPermissions();
  }, []);

  const handleCancelClick = () => {
    setIsCancel(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const handlePermissionChange = (e) => {
    const { name, checked } = e.target;
    setUserPermissions({
      ...userPermissions,
      [name]: checked,
    });
  };

  const resetForm = () => {
    setUserData({
      user_name: "",
      user_email: "",
      user_address: "",
      user_phone: "",
      user_role: "",
      user_nic: "",
      user_age: "",
      user_sex: "",
    });
    setUserPermissions(
      availablePermissions.reduce((acc, permission) => {
        acc[permission.id] = false;
        return acc;
      }, {})
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...userData, permissions: userPermissions }),
      });
      if (!response.ok) {
        if (response.status === 405) {
          console.error(
            "Method Not Allowed. The server does not allow POST requests at this endpoint."
          );
          alert(
            "Failed to create user. The server does not allow POST requests at this endpoint."
          );
        } else {
          console.error(
            "Server responded with a non-2xx status:",
            response.status
          );
          alert(
            "Failed to create user. Please check the server configuration."
          );
        }
        return;
      }
      // Handle success response
      resetForm();
      setIsCancel(true);
    } catch (error) {
      console.error("Failed to create user:", error);
      alert("Failed to create user. Please check the server configuration.");
    }
  };

  if (isCancel) {
    return <UserMamanagement />;
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-12 px-4 sm:px-6 lg:px-8">
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="font-semibold leading-7 text-gray-900 text-lg">
            Add New User
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Enter New User information.
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
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2"
                />
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
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2"
                />
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
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2"
                />
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
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2"
                />
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
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2"
                />
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
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2"
                />
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
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2"
                >
                  <option value="" disabled>
                    User role
                  </option>
                  <option value="Admin">Admin</option>
                  <option value="User">User</option>
                </select>
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
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-end gap-x-6">
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

export default AddNewUser;
