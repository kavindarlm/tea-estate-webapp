import AddNewTeaFactory from "./AddNewFactory";
import React, { useState, useEffect } from 'react';  // Import useState to manage component state
import Pagination from '../reusable/pagination';
import Modal from "../Modal";
import EditFactory from "./EditFactory";
import { useToast } from "../reusable/Toaster";
import { apiRequest } from "@/utils/api";

function FactoryList() {
  const [isAddingFactory, setIsAddingFactory] = useState(false);  // Added state to manage view
  const [factories, setFactories] = useState([]);  // Added state to store employees
  const [currentPage, setCurrentPage] = useState(1);  // Added state to store current page
  const factoriesPerPage = 7;  // Added constant to store number of employees per page
  const [totalPages, setTotalPages] = useState(1);  // Added state to store total number of pages
  const [selectedFactoryId, setSelectedFactoryId] = useState(null);  // Added state to store selected employee ID
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);  // Added state to manage edit modal
  const [filterType, setFilterType] = useState('all');  // Added state for filter type
  const [selectedDate, setSelectedDate] = useState('');  // Added state for selected date
  const [isFiltering, setIsFiltering] = useState(false);  // Added state to track filtering status
  const { showError } = useToast();

  const fetchFactories = async () => {
    try {
      let url = '/api/factory/weight';
      
      // Add query parameters for filtering if needed
      if (isFiltering && filterType !== 'all' && selectedDate) {
        url += `?filterType=${filterType}&date=${selectedDate}`;
      }
      
      const response = await apiRequest(url);
      if (!response.ok) {
        console.error('Server responded with a non-2xx status:', response.status);
        return;
      }
      const data = await response.json();
      const startIndex = (currentPage - 1) * factoriesPerPage;
      const endIndex = startIndex + factoriesPerPage;
      setFactories(data.slice(startIndex, endIndex));
      setTotalPages(Math.ceil(data.length / factoriesPerPage));
    } catch (error) {
      console.error('Failed to fetch factories:', error);
      showError('Failed to fetch factories. Please check the server configuration.');
    }
  };

  const handleAddFactoryClick = () => {  // Added function to handle button click
    setIsAddingFactory(true);  // Set the state to show AddNewTeaWeight component
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleEditClick = (id) => {
    setSelectedFactoryId(id);
    setIsEditModalOpen(true);
  }

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setSelectedFactoryId(null);
    fetchFactories();
  }

  const handleFilterChange = (e) => {
    setFilterType(e.target.value);
    if (e.target.value === 'all') {
      setIsFiltering(false);
      setSelectedDate('');
    }
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleApplyFilter = () => {
    if (filterType !== 'all' && selectedDate) {
      setIsFiltering(true);
      setCurrentPage(1); // Reset to first page when filtering
    } else if (filterType === 'all') {
      setIsFiltering(false);
      setSelectedDate('');
    }
  };

  const handleClearFilter = () => {
    setFilterType('all');
    setSelectedDate('');
    setIsFiltering(false);
    setCurrentPage(1);
  };

  // Add effect to fetch data when filter changes
  useEffect(() => {
    fetchFactories();
  }, [currentPage, factoriesPerPage, isFiltering, filterType, selectedDate]);

  // Conditionally render AddNewTeaWeight component if isAddingWeight is true
  if (isAddingFactory) {
    return <AddNewTeaFactory />;  // Return AddNewTeaWeight component
  }
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-lg font-semibold leading-6 text-gray-900">Factories</h1>
          <p className="mt-2 text-sm text-gray-700">
            List of all factories and their total weight of tea produced.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            className="block rounded-md bg-buttonColor px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-green-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
            onClick={handleAddFactoryClick}
          >
            Add Factory
          </button>
        </div>
      </div>

      {/* Filter Section */}
      <div className="mt-6 bg-gray-50 p-4 rounded-lg">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-40">
            <label htmlFor="filterType" className="block text-sm font-medium text-gray-700 mb-1">
              Filter by
            </label>
            <select
              id="filterType"
              value={filterType}
              onChange={handleFilterChange}
              className="w-full p-1 rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-sm text-black"
            >
              <option value="all">All-time total tea weight per factory</option>
              <option value="day">Specific-Date total tea weight per factory</option>
            </select>
          </div>
          
          {filterType !== 'all' && (
            <div className="flex-1 min-w-40">
              <label htmlFor="selectedDate" className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                id="selectedDate"
                value={selectedDate}
                onChange={handleDateChange}
                className="w-full p-1 rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-sm text-black"
              />
            </div>
          )}
          
          <div className="flex gap-2">
            <button
              onClick={handleApplyFilter}
              disabled={filterType !== 'all' && !selectedDate}
              className="px-4 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Apply Filter
            </button>
            
            {(isFiltering || filterType !== 'all') && (
              <button
                onClick={handleClearFilter}
                className="px-4 py-2 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-700"
              >
                Clear Filter
              </button>
            )}
          </div>
        </div>
        
        {isFiltering && (
          <div className="mt-2 text-sm text-gray-600">
            Showing weights for date: {selectedDate}
          </div>
        )}
      </div>
      <div className="mt-8 flow-root">
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
                    Total Weight
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-3">
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {factories.map((factory) => (
                  <tr key={factory.fac_id}>
                    <td className="pl-4 pr-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900 sm:pl-3">
                      {factory.fac_name}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                      {factory.fac_email}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                      {factory.fac_address}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                      {factory.total_weight}
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 sm:pr-3 text-sm font-medium">
                      <a
                        href="#"
                        onClick={() => handleEditClick(factory.fac_id)}
                        className="text-green-500 hover:text-green-600">
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
        <EditFactory factoryId={selectedFactoryId} onClose={handleCloseModal} />
      </Modal>
    </div>
  )
}


export default FactoryList;