// src/pages/api/employee/index.js

import { getAllEmployees, createEmployee} from '../../../services/employeeService';

export default async function handler(req, res) {
    const { method, body, query } = req;

    try {
        switch (method) {
            case 'GET':
                const employees = await getAllEmployees();
                res.status(200).json(employees);
                break;
            case 'POST':
                const newEmployee = await createEmployee(body);
                res.status(201).json(newEmployee);
                break;
            default:
                res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
                res.status(405).end(`Method ${method} Not Allowed`);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}