import React from 'react';
import Header from '../reusable/Header';
import EmployeeList from '../employee/EmployeeList';

function Employee() {
    return (
        <div id="employee" className='flex-1 overflow-auto'>
            <div className="py-5">
                <div className="px-4 sm:px-6 lg:px-8">
                    <Header />
                    <div className="pt-5">
                        <EmployeeList/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Employee;