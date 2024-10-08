// src/pages/api/allemployee.js

import { getTotalWeightPerEmployee } from '../../../services/employeeWeightService';

export default async function handler(req, res) {
    const { method } = req;

    try {
        switch (method) {
            case 'GET':
                // Fetch employees with their total weight
                const employeesWithTotalWeight = await getTotalWeightPerEmployee();
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
