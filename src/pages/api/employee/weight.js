// src/pages/api/allemployee.js

import { getTotalWeightPerEmployee } from '../../../services/employeeWeightService';

export default async function handler(req, res) {
    const { method, query } = req;

    try {
        switch (method) {
            case 'GET':
                let dateFilter = null;
                
                // Check if date filtering parameters are provided
                if (query.filterType && query.date) {
                    dateFilter = {
                        type: query.filterType, // 'day' for specific date filtering
                        date: query.date
                    };
                }
                
                // Fetch employees with their total weight (filtered or unfiltered)
                const employeesWithTotalWeight = await getTotalWeightPerEmployee(dateFilter);
                console.log(employeesWithTotalWeight);
                res.status(200).json(employeesWithTotalWeight);
                break;
            default:
                res.setHeader('Allow', ['GET']);
                res.status(405).end(`Method ${method} Not Allowed`);
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message });
    }
}
