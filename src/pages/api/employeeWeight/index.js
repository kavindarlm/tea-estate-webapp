// src/pages/api/employeeWeight/index.js

import { getAllEmployeeWeights, createEmployeeWeight } from '../../../services/employeeWeightService';

export default async function handler(req, res) {
    const { method, body } = req;

    try {
        switch (method) {
            case 'GET':
                const employeeWeights = await getAllEmployeeWeights();
                res.status(200).json(employeeWeights);
                break;
            case 'POST':
                const newEmployeeWeight = await createEmployeeWeight(body);
                res.status(201).json(newEmployeeWeight);
                break;
            default:
                res.setHeader('Allow', ['GET', 'POST']);
                res.status(405).end(`Method ${method} Not Allowed`);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}