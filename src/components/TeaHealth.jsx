import React from 'react';
import Header from './reusable/Header';
import Sidebar from './sidebar';


function TeaHealth() {
    return (
        <div id="reports" className='min-h-screen'>
            <div className="py-5 lg:pl-72">
                <div className="px-4 sm:px-6 lg:px-8">
                        <h1 className="text-lg font-semibold text-gray-900">Tea Health</h1>
                        <p className="mt-2 text-sm text-gray-500">
                            Welcome to the Tea Health Page. Here you can identify the Tea Leaves diseases.
                        </p>
                </div>
            </div>
        </div>
    );
}

export default TeaHealth;