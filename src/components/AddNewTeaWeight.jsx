import { PhotoIcon, UserCircleIcon } from '@heroicons/react/24/solid'
import TeaWeightSummary from './TeaWeightSummary';
import React, { useState } from 'react';  // Import useState to manage component state


function AddNewTeaWeight() {
    const [isCancel, setIsCancel] = useState(false);

    const handleCancelClick = () => {
        setIsCancel(true);
    }

    if (isCancel) {
        return <TeaWeightSummary />;
    }

    return (
        <form>
            <div className="space-y-12 px-4 sm:px-6 lg:px-8">

                <div className="border-b border-gray-900/10 pb-20">
                    <h2 className="text-base font-semibold leading-7 text-gray-900 text-lg">Add New Weight</h2>
                    <p className="mt-1 text-sm leading-6 text-gray-600">Enter new total weight of date wise</p>

                    <div className="mt-12 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <div className="sm:col-span-3">
                            <label htmlFor="date" className="block text-sm font-medium leading-6 text-gray-900">
                                Date
                            </label>
                            <div className="mt-3">
                                <input
                                    type="date"
                                    name="date"
                                    id="date"
                                    autoComplete="off"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2"
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-3">
                            <label htmlFor="totalWeight" className="block text-sm font-medium leading-6 text-gray-900">
                                Total Weight (kg)
                            </label>
                            <div className="mt-3">
                                <input
                                    type="number"
                                    name="totalWeight"
                                    id="totalWeight"
                                    autoComplete="off"
                                    placeholder='Total Weight (kg)'
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2"
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-3">
                            <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900">
                                Employee
                            </label>
                            <div className="mt-3">
                                <input
                                    type="text"
                                    name="first-name"
                                    id="first-name"
                                    autoComplete="given-name"
                                    placeholder='Employee Name'
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2"
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-3">
                            <label htmlFor="employeeWeight" className="block text-sm font-medium leading-6 text-gray-900">
                                Employee weight
                            </label>
                            <div className="mt-3">
                                <input
                                    type="number"
                                    name="employeeWeight"
                                    id="employeeWeight"
                                    autoComplete="off"
                                    placeholder='Employee Weight (kg)'
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2"
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-3">
                            <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900">
                                Factory
                            </label>
                            <div className="mt-3">
                                <input
                                    type="text"
                                    name="first-name"
                                    id="first-name"
                                    autoComplete="given-name"
                                    placeholder='Employee Name'
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2"
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-3">
                            <label htmlFor="factoryWeight" className="block text-sm font-medium leading-6 text-gray-900">
                                Factory weight
                            </label>
                            <div className="mt-3">
                                <input
                                    type="number"
                                    name="factoryWeight"
                                    id="factoryWeight"
                                    autoComplete="off"
                                    placeholder='Factory Weight (kg)'
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2"
                                />
                            </div>
                        </div>   
                    </div>
                </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-x-6">
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

export default AddNewTeaWeight;