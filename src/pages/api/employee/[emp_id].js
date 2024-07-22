// src/pages/api/employee/[emp_id].js

import { getEmployeeByID, updateEmployee, deleteEmployee } from '../../../services/employeeService';

export default async function handler(req, res) {
    const { method, body, query } = req;
    const { emp_id } = query;

    try {
        switch (method) {
            case 'GET':
                const employee = await getEmployeeByID(emp_id);
                if (!employee) {
                    res.status(404).json({ error: 'Employee not found' });
                } else {
                    res.status(200).json(employee);
                }
                break;
            case 'PUT':
                const updatedEmployee = await updateEmployee(emp_id, body);
                res.status(200).json(updatedEmployee);
                break;
            case 'DELETE':
                await deleteEmployee(emp_id);
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