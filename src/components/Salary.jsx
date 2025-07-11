import React from 'react';
import Header from './reusable/Header';
import Sidebar from './sidebar';

function Salary() {
    return (
        <div id="reports" className='min-h-screen'>
            <div className="py-5 lg:pl-64">
                <div className="px-4 sm:px-6 lg:px-8">
                    <Header />
                    <div className="pt-5">
                        <h1 className="text-lg font-semibold text-gray-900">Employees Salary</h1>
                        <p className="mt-2 text-sm text-gray-500">
                            Welcome to the Employees Salary. Here you can view all salary information about your Tea Estate employees.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Salary;