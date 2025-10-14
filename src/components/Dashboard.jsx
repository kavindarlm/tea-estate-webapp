import React, { useEffect, useState } from 'react';
import Header from './reusable/Header';

function Dashboard() {
    const [ApexCharts, setApexCharts] = useState(null);
    const [chartData, setChartData] = useState({ categories: [], data: [] });
    const [filterType, setFilterType] = useState('monthly'); // 'daily' or 'monthly'
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [loading, setLoading] = useState(true);

    // Fetch tea weight data from API
    const fetchTeaWeightData = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                type: filterType,
                year: selectedYear.toString()
            });
            
            if (filterType === 'daily') {
                params.append('month', selectedMonth.toString());
            }
            
            const response = await fetch(`/api/dashboard/tea-weight-stats?${params}`);
            const data = await response.json();
            processApiData(data);
        } catch (error) {
            console.error('Error fetching tea weight data:', error);
            setChartData({ categories: [], data: [] });
        } finally {
            setLoading(false);
        }
    };

    // Process API data into chart format
    const processApiData = (apiData) => {
        let processedData = { categories: [], data: [] };

        if (filterType === 'monthly') {
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const monthlyData = Array(12).fill(0);
            
            apiData.forEach(item => {
                const monthIndex = parseInt(item.month) - 1;
                monthlyData[monthIndex] = parseFloat(item.total_weight) || 0;
            });

            processedData.categories = months;
            processedData.data = monthlyData;
        } else {
            const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
            const dailyData = Array(daysInMonth).fill(0);
            
            apiData.forEach(item => {
                const dayIndex = parseInt(item.day) - 1;
                if (dayIndex >= 0 && dayIndex < daysInMonth) {
                    dailyData[dayIndex] = parseFloat(item.total_weight) || 0;
                }
            });

            processedData.categories = Array.from({length: daysInMonth}, (_, i) => `Day ${i + 1}`);
            processedData.data = dailyData;
        }

        setChartData(processedData);
    };

    useEffect(() => {
        fetchTeaWeightData();
    }, [filterType, selectedYear, selectedMonth]);

    useEffect(() => {
        import('apexcharts').then(ApexChartsModule => {
            setApexCharts(() => ApexChartsModule.default);
        });
    }, []);

    useEffect(() => {
        if (ApexCharts && chartData.categories.length > 0) {
            // Clear previous chart
            const chartElement = document.querySelector("#bar-chart");
            if (chartElement) {
                chartElement.innerHTML = '';
            }

            // Add custom CSS for ApexCharts menu
            const style = document.createElement('style');
            style.textContent = `
                .apexcharts-menu {
                    background: white !important;
                    border: 1px solid #e5e7eb !important;
                    border-radius: 6px !important;
                    box-shadow: 0 6px 6px -1px rgba(0, 0, 0, 0.1) !important;
                }
                .apexcharts-menu-item {
                    color: #374151 !important;
                    font-size: 12px !important;
                }
                .apexcharts-menu-item:hover {
                    background-color: #f9fafb !important;
                    color: #059669 !important;
                }
                .apexcharts-toolbar {
                    color: #6b7280 !important;
                }
                .apexcharts-toolbar svg {
                    fill: #6b7280 !important;
                }
                .apexcharts-toolbar svg:hover {
                    fill: #059669 !important;
                }
            `;
            document.head.appendChild(style);

            const chartConfig = {
                chart: {
                    type: 'bar',
                    height: 350,
                    toolbar: {
                        show: true,
                        tools: {
                            download: true,
                            selection: true,
                            zoom: true,
                            zoomin: true,
                            zoomout: true,
                            pan: true,
                            reset: true
                        },
                        export: {
                            csv: {
                                filename: `tea-weight-${filterType}-${selectedYear}${filterType === 'daily' ? `-${selectedMonth}` : ''}`,
                                headerCategory: filterType === 'daily' ? 'Day' : 'Month',
                                headerValue: 'Tea Weight (Kg)'
                            },
                            svg: {
                                filename: `tea-weight-chart-${filterType}-${selectedYear}${filterType === 'daily' ? `-${selectedMonth}` : ''}`
                            },
                            png: {
                                filename: `tea-weight-chart-${filterType}-${selectedYear}${filterType === 'daily' ? `-${selectedMonth}` : ''}`
                            }
                        }
                    }
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
                    data: chartData.data
                }],
                xaxis: {
                    categories: chartData.categories
                },
                yaxis: {
                    title: {
                        text: 'Kg (weight)'
                    }
                },
                fill: {
                    opacity: 1,
                    colors: ['#36CD61']
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
    }, [ApexCharts, chartData]);

    return (
        <div id="dashboard" className='flex-1 overflow-auto'>
            <div className="py-5">
                <div className="px-4 sm:px-6 lg:px-8 h-full flex flex-col">
                    <Header />
                    <div className="px-4 sm:px-6 lg:px-8 mt-10">
                        <h1 className="text-lg font-semibold leading-6 text-gray-900">Dashboard</h1>
                        <p className="mt-2 text-sm text-gray-700">
                            A list of all the tea weights in your estate including their date and total weight.
                        </p>
                        
                        {/* Filter Controls */}
                        <div className="mt-6 bg-white p-4 rounded-lg shadow">
                            <div className="flex flex-wrap gap-4 items-center">
                                {/* Filter Type */}
                                <div className="flex items-center space-x-2">
                                    <label className="text-sm font-medium text-gray-700">View:</label>
                                    <select 
                                        value={filterType} 
                                        onChange={(e) => setFilterType(e.target.value)}
                                        className="border text-gray-700 border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                    >
                                        <option value="monthly">Monthly</option>
                                        <option value="daily">Daily</option>
                                    </select>
                                </div>

                                {/* Year Selector */}
                                <div className="flex items-center space-x-2">
                                    <label className="text-sm font-medium text-gray-700">Year:</label>
                                    <select 
                                        value={selectedYear} 
                                        onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                                        className="border text-gray-700 border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                    >
                                        {Array.from({length: 5}, (_, i) => new Date().getFullYear() - 2 + i).map(year => (
                                            <option key={year} value={year}>{year}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Month Selector (only show for daily view) */}
                                {filterType === 'daily' && (
                                    <div className="flex items-center space-x-2">
                                        <label className="text-sm font-medium text-gray-700">Month:</label>
                                        <select 
                                            value={selectedMonth} 
                                            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                                            className="border text-gray-700 border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                        >
                                            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, index) => (
                                                <option key={index + 1} value={index + 1}>{month}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                {/* Refresh Button */}
                                <button 
                                    onClick={fetchTeaWeightData}
                                    disabled={loading}
                                    className="bg-green-600 text-white px-4 py-1 rounded-md text-sm hover:bg-green-700 disabled:opacity-50"
                                >
                                    {loading ? 'Loading...' : 'Refresh'}
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <div className="pt-5 flex-1 overflow-auto">
                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="text-gray-500">Loading chart data...</div>
                            </div>
                        ) : (
                            <div id="bar-chart"></div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;