import React, { useState } from 'react';  // Import useState to manage component state
import AddNewTeaWeight from './AddNewTeaWeight';
import { useRouter } from 'next/router';
import Pagination from './reusable/pagination';



const Weight = [
    { id:1, date: '2021-10-01', total_weight: 100 },
    { id:2,date: '2021-10-02', total_weight: 200 },
    { id:3,date: '2021-10-03', total_weight: 300 },
    { id:4,date: '2021-10-04', total_weight: 400 },
    { id:5,date: '2021-10-05', total_weight: 500 },
    { id:6,date: '2021-10-06', total_weight: 600 },
    { id:7,date: '2021-10-07', total_weight: 700 },
    // More people...
];


function TeaWeightSummary() {
    const router = useRouter();
    const [isAddingWeight, setIsAddingWeight] = useState(false);  // Added state to manage view

    const handleAddWeightClick = () => {  // Added function to handle button click
       
        setIsAddingWeight(true);  // Set the state to show AddNewTeaWeight component
        // router.push('/tea-weight/add-tea-weight');
    };

    // Conditionally render AddNewTeaWeight component if isAddingWeight is true
    if (isAddingWeight) {
        return <AddNewTeaWeight/>;  // Return AddNewTeaWeight component
    }
    return (
        <div className="px-4 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-lg font-semibold leading-6 text-gray-900">Tea Weight</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        A list of all the tea weights in your estate including their date and total weight.
                    </p>
                </div>
                <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                    <button
                        type="button"
                        className="block rounded-md bg-green-400 px-3 py-2 text-center text-sm font-semibold text-black shadow-sm hover:bg-green-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                        onClick={handleAddWeightClick}  // Added onClick to handle button click
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
                                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3">
                                        Date
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
                                {Weight.map((person, personIdx) => (
                                    <tr key={person.id} className={personIdx % 2 === 0 ? undefined : 'bg-gray-50'}>
                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-3">{person.date}</td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{person.total_weight}</td>
                                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3">
                                            <a href="#" className="text-green-500 hover:text-green-600">Edit</a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <Pagination/>
        </div>

    )
}

export default TeaWeightSummary;