// src/pages/api/dashboard/tea-weight-stats.js

import db from '../../../../models';
import { Op } from 'sequelize';

const { TeaWeight } = db;

export default async function handler(req, res) {
    const { method, query } = req;

    try {
        switch (method) {
            case 'GET':
                const { type, year, month } = query;
                const currentYear = parseInt(year) || new Date().getFullYear();
                const currentMonth = parseInt(month) || new Date().getMonth() + 1;
                
                let whereCondition = {};
                
                if (type === 'daily') {
                    // Get data for specific month
                    const startDate = new Date(currentYear, currentMonth - 1, 1);
                    const endDate = new Date(currentYear, currentMonth, 0);
                    
                    whereCondition = {
                        tea_weight_date: {
                            [Op.between]: [startDate, endDate]
                        }
                    };
                } else {
                    // Get data for entire year
                    const startDate = new Date(currentYear, 0, 1);
                    const endDate = new Date(currentYear, 11, 31);
                    
                    whereCondition = {
                        tea_weight_date: {
                            [Op.between]: [startDate, endDate]
                        }
                    };
                }

                // Fetch all records and process them in JavaScript
                const allData = await TeaWeight.findAll({
                    where: whereCondition,
                    order: [['tea_weight_date', 'ASC']],
                    raw: true
                });

                let processedData = [];

                if (type === 'daily') {
                    // Group by day
                    const dailyTotals = {};
                    
                    allData.forEach(record => {
                        const date = new Date(record.tea_weight_date);
                        const day = date.getDate();
                        
                        if (!dailyTotals[day]) {
                            dailyTotals[day] = 0;
                        }
                        dailyTotals[day] += parseFloat(record.tea_weight_total) || 0;
                    });
                    
                    // Convert to array format
                    for (let day = 1; day <= 31; day++) {
                        processedData.push({
                            day: day,
                            total_weight: dailyTotals[day] || 0
                        });
                    }
                } else {
                    // Group by month
                    const monthlyTotals = {};
                    
                    allData.forEach(record => {
                        const date = new Date(record.tea_weight_date);
                        const month = date.getMonth() + 1;
                        
                        if (!monthlyTotals[month]) {
                            monthlyTotals[month] = 0;
                        }
                        monthlyTotals[month] += parseFloat(record.tea_weight_total) || 0;
                    });
                    
                    // Convert to array format
                    for (let month = 1; month <= 12; month++) {
                        processedData.push({
                            month: month,
                            total_weight: monthlyTotals[month] || 0
                        });
                    }
                }

                res.status(200).json(processedData);
                break;
                
            default:
                res.setHeader('Allow', ['GET']);
                res.status(405).end(`Method ${method} Not Allowed`);
        }
    } catch (error) {
        console.error('Dashboard API Error:', error);
        res.status(500).json({ error: error.message });
    }
}
