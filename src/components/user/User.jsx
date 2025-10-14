import React from 'react';
import Header from '../reusable/Header';
import UserMamanagement from '../user/UserManagement';
  

function User() {
    return (
        <div id="user" className='flex-1 overflow-auto'>
            <div className="py-5">
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