import React from 'react';
import Header from './reusable/Header';
import EmployeeList from './EmployeeList';




function Employee() {
    return (
        <div id="employee">
            <div className="py-5 lg:pl-72">
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