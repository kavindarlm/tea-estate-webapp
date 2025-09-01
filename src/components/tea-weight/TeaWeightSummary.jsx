import React, { useState, useEffect } from "react"; // Import useState and useEffect to manage component state
import AddNewTeaWeight from "../tea-weight/AddNewTeaWeight";
import { useRouter } from "next/router";
import Pagination from "../reusable/pagination";

function TeaWeightSummary() {
  const router = useRouter();
  const [isAddingWeight, setIsAddingWeight] = useState(false); // Added state to manage view
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [teaWeights, setTeaWeights] = useState([]); // State to store tea weights
  const [isLoading, setIsLoading] = useState(true); // State to manage loading
  const [isDeleting, setIsDeleting] = useState(false); // State for delete operation
  const teaWeightsPerPage = 7; // Number of items per page

  useEffect(() => {
    fetchTeaWeights();
  }, [currentPage]);

  const fetchTeaWeights = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:3000/api/teaWeight');
      if (!response.ok) {
        console.error('Failed to fetch tea weights:', response.status);
        return;
      }
      const data = await response.json();
      
      // Sort by date in descending order (newest first)
      const sortedData = data.sort((a, b) => new Date(b.tea_weight_date) - new Date(a.tea_weight_date));
      
      // Calculate pagination
      const startIndex = (currentPage - 1) * teaWeightsPerPage;
      const endIndex = startIndex + teaWeightsPerPage;
      const paginatedData = sortedData.slice(startIndex, endIndex);
      
      setTeaWeights(paginatedData);
      setTotalPages(Math.ceil(sortedData.length / teaWeightsPerPage));
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to fetch tea weights:', error);
      setIsLoading(false);
    }
  };

  const handleAddWeightClick = () => {
    // Added function to handle button click
    setIsAddingWeight(true); // Set the state to show AddNewTeaWeight component
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleDeleteClick = async (teaWeightId, date) => {
    // Show confirmation dialog
    const confirmed = window.confirm(
      `Are you sure you want to delete the tea weight record for ${formatDate(date)}?\n\nThis will permanently remove:\n• The tea weight summary\n• All related employee weights\n• All related factory weights\n\nThis action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setIsDeleting(true);
      const response = await fetch(`http://localhost:3000/api/teaWeight/${teaWeightId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete tea weight');
      }

      // Show success message
      alert('Tea weight record deleted successfully!');
      
      // Refresh the tea weights list
      fetchTeaWeights();
    } catch (error) {
      console.error('Failed to delete tea weight:', error);
      alert('Failed to delete tea weight: ' + error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  if (isLoading) {
    return <div className="px-4 sm:px-6 lg:px-8">Loading...</div>;
  }

  // Conditionally render AddNewTeaWeight component if isAddingWeight is true
  if (isAddingWeight) {
    return <AddNewTeaWeight />; // Return AddNewTeaWeight component
  }
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-lg font-semibold leading-6 text-gray-900">
            Tea Weight
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all the tea weights in your estate including their date
            and total weight.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            className="block rounded-md bg-buttonColor px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-green-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
            onClick={handleAddWeightClick} // Added onClick to handle button click
          >
            Add weight
          </button>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Total Weight (Kg)
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-3">
                    <span className="sr-only">Delete</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {teaWeights.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="px-6 py-8 text-center text-sm text-gray-500">
                      No tea weight records found. Click "Add weight" to create the first entry.
                    </td>
                  </tr>
                ) : (
                  teaWeights.map((teaWeight, index) => (
                    <tr
                      key={teaWeight.tea_weight_id}
                      className={index % 2 === 0 ? undefined : "bg-gray-50"}
                    >
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-3">
                        {formatDate(teaWeight.tea_weight_date)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {teaWeight.tea_weight_total}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3">
                        <button
                          onClick={() => handleDeleteClick(teaWeight.tea_weight_id, teaWeight.tea_weight_date)}
                          disabled={isDeleting}
                          className="text-red-500 hover:text-red-700 disabled:text-red-300 disabled:cursor-not-allowed"
                        >
                          {isDeleting ? 'Deleting...' : 'Delete'}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export default TeaWeightSummary;
