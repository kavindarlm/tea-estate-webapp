import React, { useEffect, useState } from 'react';
import Header from './reusable/Header';

function Dashboard() {
    const [ApexCharts, setApexCharts] = useState(null);

    useEffect(() => {
        import('apexcharts').then(ApexChartsModule => {
            setApexCharts(() => ApexChartsModule.default);
        });
    }, []);

    useEffect(() => {
        if (ApexCharts) {
            const chartConfig = {
                // your chart configuration here

                chart: {
                    type: 'bar',
                    height: 350
                },
                plotOptions: {
                    bar: {
                        horizontal: false,
                        columnWidth: '55%',
                        endingShape: 'rounded'
                    },
                },
                dataLabels: {
                    enabled: true
                },
                stroke: {
                    show: true,
                    width: 2,
                    colors: ['transparent']
                },
                series: [{
                    name: 'Total Tea Weight',
                    data: [253, 232, 233, 252, 213, 244, 232]
                }],
                xaxis: {
                    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                },
                yaxis: {
                    title: {
                        text: 'Kg (weight)'
                    }
                },
                fill: {
                    opacity: 1,
                    colors: ['#48FF99']
                },
                tooltip: {
                    y: {
                        formatter: function (val) {
                            return "Kg " + val + " weight"
                        }
                    }
                },
                grid: {
                    borderColor: '#f1f1f1'
                },
            };
    
            const chart = new ApexCharts(document.querySelector("#bar-chart"), chartConfig);
            chart.render();
        }
    }, [ApexCharts]);

    return (
        <div id="dashboard" className='min-h-screen'>
            <div className="py-5 lg:pl-72">
                <div className="px-4 sm:px-6 lg:px-8">
                    <Header />
                    <div className="px-4 sm:px-6 lg:px-8 mt-10">
                    <h1 className="text-lg font-semibold leading-6 text-gray-900">Dashboard</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        A list of all the tea weights in your estate including their date and total weight.
                    </p>
                    </div>
                    <div className="pt-5 mb-20">
                        <div id="bar-chart"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;