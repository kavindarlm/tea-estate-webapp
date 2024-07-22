
import React, { useState } from 'react';
import Header from './reusable/Header';
import TeaWeightSummary from './TeaWeightSummary';




function TeaWeight() {
    return (
        <div id="tea-weightsss">
            <div className="py-5 lg:pl-72">
                <div className="px-4 sm:px-6 lg:px-8">
                    <Header />
                    <div className="pt-5">
                        <TeaWeightSummary />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TeaWeight;