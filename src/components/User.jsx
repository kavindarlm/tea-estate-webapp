import React from 'react';
import Header from './reusable/Header';
import UserMamanagement from './UserManagement';
  

function User() {
    return (
        <div id="user" className='min-h-screen'>
            <div className="py-5 lg:pl-72">
                <div className="px-4 sm:px-6 lg:px-8">
                <Header />
                    <div className="pt-5">
                      <UserMamanagement />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default User;