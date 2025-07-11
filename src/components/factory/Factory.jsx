import React from 'react';
import Header from '../reusable/Header';
import FactoryList from './FactoryList';
  

function Factory() {
    return (
        <div id="factory" className='min-h-screen'>
            <div className="py-5 lg:pl-64">
                <div className="px-4 sm:px-6 lg:px-8">
                <Header />
                    <div className="pt-5">
                      <FactoryList/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Factory;