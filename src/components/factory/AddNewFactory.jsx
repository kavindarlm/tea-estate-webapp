import React, { useState } from 'react';  // Import useState to manage component state
import FactoryList from './FactoryList';


function AddNewTeaFactory() {
    const[isCancel, setIsCancel] = useState(false);

    const [factoryData, setFactoryData] = useState({
        fac_name: '',
        fac_address: '',
        fac_email: ''
    });

    const handleCancelClick = () => {
        setIsCancel(true);
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFactoryData({
            ...factoryData,
            [name]: value
        });
    };

    const resetForm = () => {
        setFactoryData({
            fac_name: '',
            fac_address: '',
            fac_email: ''
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3000/api/factory', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(factoryData),
            });
            if (!response.ok) {
                if (response.status === 405) {
                    console.error('Method Not Allowed. The server does not allow POST requests at this endpoint.');
                    alert('Failed to create factory. The server does not allow POST requests at this endpoint.');
                } else {
                    console.error('Server responded with a non-2xx status:', response.status);
                    alert('Failed to create factory. Please check the server configuration.');
                }
                return;
            }
            // Handle success response
            alert('Factory created successfully');
            resetForm();
        } catch (error) {
            console.error('Failed to create factory:', error);
            alert('Failed to create factory. Please check the server configuration.');
        }
    };

    if (isCancel) {
        return <FactoryList/>;
    }

    return (
        <form onSubmit={handleSubmit}>
          <div className="space-y-12 px-4 sm:px-6 lg:px-8 mt-8">
                
            <div className="border-b border-gray-900/10 pb-12">
              <h2 className="text-base font-semibold leading-7 text-gray-900 text-lg">Add New Factory</h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">Enter new factory informations</p>
    
              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-4">
                  <label htmlFor="factory-name" className="block text-sm font-medium leading-6 text-gray-900">
                    Factory name
                  </label>
                  <div className="mt-3">
                    <input
                      type="text"
                      name="fac_name"
                      id="fac_name"
                      value={factoryData.fac_name}
                      onChange={handleInputChange}
                      autoComplete="given-name"
                      placeholder='Factory name'
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2"
                    />
                  </div>
                </div>
    
                <div className="sm:col-span-4">
                  <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                    Email address
                  </label>
                  <div className="mt-3">
                    <input
                      id="fac_email"
                      name="fac_email"
                      value={factoryData.fac_email}
                      onChange={handleInputChange}
                      type="email"
                      autoComplete="email"
                      placeholder='Email address'
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2"
                    />
                  </div>
                </div>
    
                <div className="col-span-full">
                  <label htmlFor="address" className="block text-sm font-medium leading-6 text-gray-900">
                    Address
                  </label>
                  <div className="mt-3">
                    <input
                      type="text"
                      name="fac_address"
                      value={factoryData.fac_address}
                      onChange={handleInputChange}
                      id="fac_address"
                      autoComplete="address"
                      placeholder='Address'
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
    
          <div className="mt-10 flex items-center justify-end gap-x-6">
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
      )
}

export default AddNewTeaFactory;