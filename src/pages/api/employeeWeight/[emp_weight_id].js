// src/pages/api/employeeWeight/[emp_weight_id].js

import { getEmployeeWeightByID, updateEmployeeWeight, deleteEmployeeWeight } from '../../../services/employeeWeightService';


export default async function handler(req, res) {
    const { method, body, query } = req;
    const { emp_weight_id } = query;

    try {
        switch (method) {
            case 'GET':
                const employeeWeight = await getEmployeeWeightByID(emp_weight_id);
                if (!employeeWeight) {
                    res.status(404).json({ error: 'Employee Weight not found' });
                } else {
                    res.status(200).json(employeeWeight);
                }
                break;
            case 'PUT':
                const updatedEmployeeWeight = await updateEmployeeWeight(emp_weight_id, body);
                res.status(200).json(updatedEmployeeWeight);
                break;
            case 'DELETE':
                await deleteEmployeeWeight(emp_weight_id);
                res.status(204).end();
                break;
            default:
                res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
                res.status(405).end(`Method ${method} Not Allowed`);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}