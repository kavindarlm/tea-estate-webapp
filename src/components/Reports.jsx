import React, { useEffect, useState } from "react";
import Header from "./reusable/Header";
import {
  ChartBarIcon,
  UsersIcon,
  HomeModernIcon,
  TrophyIcon,
  DocumentChartBarIcon,
} from "@heroicons/react/24/outline";

function Reports() {
  const [reportData, setReportData] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedReport, setSelectedReport] = useState("summary");
  const [loading, setLoading] = useState(true);
  const [ApexCharts, setApexCharts] = useState(null);

  // Import ApexCharts
  useEffect(() => {
    import("apexcharts").then((ApexChartsModule) => {
      setApexCharts(() => ApexChartsModule.default);
    });
  }, []);

  // Fetch report data
  const fetchReportData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/reports?reportType=${selectedReport}&year=${selectedYear}`
      );
      const data = await response.json();
      setReportData(data);
    } catch (error) {
      console.error("Error fetching report data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, [selectedYear, selectedReport]);

  const formatNumber = (num) => {
    return new Intl.NumberFormat().format(Math.round(num || 0));
  };

  const formatWeight = (weight) => {
    return `${formatNumber(weight)} Kg`;
  };

  if (loading) {
    return (
      <div id="reports" className="min-h-screen">
        <div className="py-5 lg:pl-64">
          <div className="px-4 sm:px-6 lg:px-8">
            <Header />
            <div className="flex justify-center items-center h-64">
              <div className="text-gray-500">Loading reports...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="reports" className="min-h-screen">
      <div className="py-5 lg:pl-64">
        <div className="px-4 sm:px-6 lg:px-8">
          <Header />
          <div className="pt-5">
            <div className="sm:flex sm:items-center sm:justify-between">
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  Tea Estate Reports
                </h1>
                <p className="mt-2 text-sm text-gray-500">
                  Comprehensive analytics and insights for your tea estate
                  operations
                </p>
              </div>

              {/* Controls */}
              <div className="mt-4 sm:mt-0 flex gap-4">
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  className="border text-gray-700 border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {Array.from(
                    { length: 5 },
                    (_, i) => new Date().getFullYear() - 2 + i
                  ).map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedReport}
                  onChange={(e) => setSelectedReport(e.target.value)}
                  className="border text-gray-700 border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="summary">Summary Report</option>
                  <option value="top-performers">Top Performers</option>
                  <option value="employee-performance">
                    Employee Performance
                  </option>
                  <option value="factory-analysis">Factory Analysis</option>
                </select>
              </div>
            </div>

            {/* Summary Cards */}
            {selectedReport === "summary" &&
              (reportData?.summary ||
                reportData?.totalTeaWeight !== undefined) && (
                <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <ChartBarIcon className="h-6 w-6 text-green-600" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">
                              Total Tea Production
                            </dt>
                            <dd className="text-lg font-medium text-gray-900">
                              {formatWeight(
                                (reportData?.summary || reportData)
                                  ?.totalTeaWeight
                              )}
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <UsersIcon className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">
                              Total Employees
                            </dt>
                            <dd className="text-lg font-medium text-gray-900">
                              {formatNumber(
                                (reportData?.summary || reportData)
                                  ?.totalEmployees
                              )}
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <HomeModernIcon className="h-6 w-6 text-purple-600" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">
                              Total Factories
                            </dt>
                            <dd className="text-lg font-medium text-gray-900">
                              {formatNumber(
                                (reportData?.summary || reportData)
                                  ?.totalFactories
                              )}
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <DocumentChartBarIcon className="h-6 w-6 text-orange-600" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">
                              Avg Daily Production
                            </dt>
                            <dd className="text-lg font-medium text-gray-900">
                              {formatWeight(
                                (reportData?.summary || reportData)
                                  ?.avgDailyProduction
                              )}
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            {selectedReport === "top-performers" &&
              reportData?.topEmployees && (
                <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-white shadow rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                      <TrophyIcon className="h-5 w-5 text-yellow-500 mr-2" />
                      Top Performing Employees
                    </h3>
                    <div className="space-y-3">
                      {reportData.topEmployees.map((employee, index) => (
                        <div
                          key={employee.emp_id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center">
                            <span
                              className={`inline-flex items-center justify-center h-6 w-6 rounded-full text-xs font-medium text-white mr-3 ${
                                index === 0
                                  ? "bg-yellow-500"
                                  : index === 1
                                  ? "bg-gray-400"
                                  : index === 2
                                  ? "bg-orange-600"
                                  : "bg-gray-300"
                              }`}
                            >
                              {index + 1}
                            </span>
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {employee["Employee.emp_name"] ||
                                  `Employee ${employee.emp_id}`}
                              </p>
                              <p className="text-xs text-gray-500">
                                {employee["Employee.emp_sex"] || "Worker"}
                              </p>
                            </div>
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            {formatWeight(employee.total_contribution)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white shadow rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                      <HomeModernIcon className="h-5 w-5 text-blue-500 mr-2" />
                      Top Performing Factories
                    </h3>
                    <div className="space-y-3">
                      {reportData.topFactories?.map((factory, index) => (
                        <div
                          key={factory.fac_id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center">
                            <span
                              className={`inline-flex items-center justify-center h-6 w-6 rounded-full text-xs font-medium text-white mr-3 ${
                                index === 0
                                  ? "bg-yellow-500"
                                  : index === 1
                                  ? "bg-gray-400"
                                  : index === 2
                                  ? "bg-orange-600"
                                  : "bg-gray-300"
                              }`}
                            >
                              {index + 1}
                            </span>
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {factory["Factory.fac_name"] ||
                                  `Factory ${factory.fac_id}`}
                              </p>
                              <p className="text-xs text-gray-500">
                                {factory["Factory.fac_address"] || "No address"}
                              </p>
                            </div>
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            {formatWeight(factory.total_processed)}
                          </span>
                        </div>
                      )) || (
                        <p className="text-gray-500">
                          No factory data available
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

            {/* Employee Performance */}
            {selectedReport === "employee-performance" &&
              reportData?.employeeStats && (
                <div className="mt-8 bg-white shadow rounded-lg">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">
                      Employee Performance -{" "}
                      {new Date().toLocaleString("default", { month: "long" })}{" "}
                      {selectedYear}
                    </h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Employee
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Gender
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Total Weight
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Working Days
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Daily Average
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {reportData.employeeStats.map((employee, index) => (
                          <tr
                            key={employee.emp_id}
                            className={
                              index % 2 === 0 ? "bg-white" : "bg-gray-50"
                            }
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {employee["Employee.emp_name"] ||
                                `Employee ${employee.emp_id}`}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {employee["Employee.emp_sex"] || "N/A"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatWeight(employee.total_weight)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {employee.working_days} days
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatWeight(employee.avg_daily_weight)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

            {/* Factory Analysis */}
            {selectedReport === "factory-analysis" &&
              reportData?.factoryStats && (
                <div className="mt-8 bg-white shadow rounded-lg">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">
                      Factory Analysis - {selectedYear}
                    </h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Factory
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Address
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Total Processed
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Deliveries
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Avg Per Delivery
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {reportData.factoryStats.map((factory, index) => (
                          <tr
                            key={factory.fac_id}
                            className={
                              index % 2 === 0 ? "bg-white" : "bg-gray-50"
                            }
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {factory["Factory.fac_name"] ||
                                `Factory ${factory.fac_id}`}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {factory["Factory.fac_address"] || "No address"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatWeight(factory.total_weight)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {factory.total_deliveries}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatWeight(factory.avg_delivery_weight)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reports;
