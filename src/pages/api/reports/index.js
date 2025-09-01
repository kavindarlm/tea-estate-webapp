// src/pages/api/reports/index.js

import db from '../../../../models';
import { Op, fn, col } from 'sequelize';

const { TeaWeight, EmployeeWeight, FactoryWeight, Employee, Factory, SalaryConfig } = db;

export default async function handler(req, res) {
    const { method, query } = req;

    try {
        switch (method) {
            case 'GET':
                const { reportType, year, month } = query;
                const currentYear = parseInt(year) || new Date().getFullYear();
                const currentMonth = parseInt(month) || new Date().getMonth() + 1;
                
                let reportData = {};

                switch (reportType) {
                    case 'summary':
                        reportData = await getSummaryReport(currentYear);
                        break;
                    case 'employee-performance':
                        reportData = await getEmployeePerformanceReport(currentYear, currentMonth);
                        break;
                    case 'factory-analysis':
                        reportData = await getFactoryAnalysisReport(currentYear);
                        break;
                    case 'top-performers':
                        reportData = await getTopPerformersReport(currentYear);
                        break;
                    default:
                        reportData = await getAllReports(currentYear, currentMonth);
                }

                res.status(200).json(reportData);
                break;
                
            default:
                res.setHeader('Allow', ['GET']);
                res.status(405).end(`Method ${method} Not Allowed`);
        }
    } catch (error) {
        console.error('Reports API Error:', error);
        res.status(500).json({ error: error.message });
    }
}

// Summary Report - Key metrics overview
async function getSummaryReport(year) {
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);

    const [totalTeaWeight, totalEmployees, totalFactories, avgDailyProduction] = await Promise.all([
        TeaWeight.sum('tea_weight_total', {
            where: { tea_weight_date: { [Op.between]: [startDate, endDate] } }
        }),
        Employee.count(),
        Factory.count(),
        TeaWeight.findAll({
            attributes: [[fn('AVG', col('tea_weight_total')), 'avg_daily']],
            where: { tea_weight_date: { [Op.between]: [startDate, endDate] } },
            raw: true
        })
    ]);

    return {
        totalTeaWeight: totalTeaWeight || 0,
        totalEmployees,
        totalFactories,
        avgDailyProduction: avgDailyProduction[0]?.avg_daily || 0,
        year
    };
}

// Employee Performance Report
async function getEmployeePerformanceReport(year, month) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    try {
        const employeeStats = await EmployeeWeight.findAll({
            attributes: [
                'emp_id',
                [fn('SUM', col('emp_weight')), 'total_weight'],
                [fn('COUNT', col('emp_weight_id')), 'working_days'],
                [fn('AVG', col('emp_weight')), 'avg_daily_weight']
            ],
            include: [{
                model: Employee,
                attributes: ['emp_name', 'emp_sex'],
                required: false
            }],
            where: {
                emp_weight_date: { [Op.between]: [startDate, endDate] }
            },
            group: ['emp_id'],
            order: [[fn('SUM', col('emp_weight')), 'DESC']],
            raw: true
        });

        return {
            employeeStats,
            year,
            month
        };
    } catch (error) {
        console.error('Employee Performance Report Error:', error);
        // Fallback without associations
        const employeeStats = await EmployeeWeight.findAll({
            attributes: [
                'emp_id',
                [fn('SUM', col('emp_weight')), 'total_weight'],
                [fn('COUNT', col('emp_weight_id')), 'working_days'],
                [fn('AVG', col('emp_weight')), 'avg_daily_weight']
            ],
            where: {
                emp_weight_date: { [Op.between]: [startDate, endDate] }
            },
            group: ['emp_id'],
            order: [[fn('SUM', col('emp_weight')), 'DESC']],
            raw: true
        });

        return {
            employeeStats,
            year,
            month
        };
    }
}

// Factory Analysis Report
async function getFactoryAnalysisReport(year) {
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);

    try {
        const factoryStats = await FactoryWeight.findAll({
            attributes: [
                'fac_id',
                [fn('SUM', col('fac_weight')), 'total_weight'],
                [fn('COUNT', col('fac_weight_id')), 'total_deliveries'],
                [fn('AVG', col('fac_weight')), 'avg_delivery_weight'],
                [fn('MAX', col('fac_weight')), 'max_delivery'],
                [fn('MIN', col('fac_weight')), 'min_delivery']
            ],
            include: [{
                model: Factory,
                attributes: ['fac_name', 'fac_address'],
                required: false
            }],
            where: {
                fac_weight_date: { [Op.between]: [startDate, endDate] }
            },
            group: ['fac_id'],
            order: [[fn('SUM', col('fac_weight')), 'DESC']],
            raw: true
        });

        return {
            factoryStats,
            year
        };
    } catch (error) {
        console.error('Factory Analysis Report Error:', error);
        // Fallback without associations
        const factoryStats = await FactoryWeight.findAll({
            attributes: [
                'fac_id',
                [fn('SUM', col('fac_weight')), 'total_weight'],
                [fn('COUNT', col('fac_weight_id')), 'total_deliveries'],
                [fn('AVG', col('fac_weight')), 'avg_delivery_weight']
            ],
            where: {
                fac_weight_date: { [Op.between]: [startDate, endDate] }
            },
            group: ['fac_id'],
            order: [[fn('SUM', col('fac_weight')), 'DESC']],
            raw: true
        });

        return {
            factoryStats,
            year
        };
    }
}

// Top Performers Report
async function getTopPerformersReport(year) {
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);

    try {
        const [topEmployees, topFactories] = await Promise.all([
            EmployeeWeight.findAll({
                attributes: [
                    'emp_id',
                    [fn('SUM', col('emp_weight')), 'total_contribution']
                ],
                include: [{
                    model: Employee,
                    attributes: ['emp_name', 'emp_sex'],
                    required: false
                }],
                where: {
                    emp_weight_date: { [Op.between]: [startDate, endDate] }
                },
                group: ['emp_id'],
                order: [[fn('SUM', col('emp_weight')), 'DESC']],
                limit: 10,
                raw: true
            }),
            FactoryWeight.findAll({
                attributes: [
                    'fac_id',
                    [fn('SUM', col('fac_weight')), 'total_processed']
                ],
                include: [{
                    model: Factory,
                    attributes: ['fac_name', 'fac_address'],
                    required: false
                }],
                where: {
                    fac_weight_date: { [Op.between]: [startDate, endDate] }
                },
                group: ['fac_id'],
                order: [[fn('SUM', col('fac_weight')), 'DESC']],
                limit: 5,
                raw: true
            })
        ]);

        return {
            topEmployees,
            topFactories,
            year
        };
    } catch (error) {
        console.error('Top Performers Report Error:', error);
        // Fallback without associations
        const [topEmployees, topFactories] = await Promise.all([
            EmployeeWeight.findAll({
                attributes: [
                    'emp_id',
                    [fn('SUM', col('emp_weight')), 'total_contribution']
                ],
                where: {
                    emp_weight_date: { [Op.between]: [startDate, endDate] }
                },
                group: ['emp_id'],
                order: [[fn('SUM', col('emp_weight')), 'DESC']],
                limit: 10,
                raw: true
            }),
            FactoryWeight.findAll({
                attributes: [
                    'fac_id',
                    [fn('SUM', col('fac_weight')), 'total_processed']
                ],
                where: {
                    fac_weight_date: { [Op.between]: [startDate, endDate] }
                },
                group: ['fac_id'],
                order: [[fn('SUM', col('fac_weight')), 'DESC']],
                limit: 5,
                raw: true
            })
        ]);

        return {
            topEmployees,
            topFactories,
            year
        };
    }
}

// Get All Reports - Dashboard overview
async function getAllReports(year, month) {
    const [summary, topPerformers] = await Promise.all([
        getSummaryReport(year),
        getTopPerformersReport(year)
    ]);

    return {
        summary,
        topPerformers
    };
}
