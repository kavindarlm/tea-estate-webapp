// src/pages/api/salary/calculate.js

import { calculateEmployeeSalary, calculateAllEmployeesSalary } from '../../../services/salaryService';

export default async function handler(req, res) {
    const { method, query } = req;

    try {
        switch (method) {
            case 'GET':
                const { employeeId, date } = query;
                
                if (!date) {
                    return res.status(400).json({ error: 'Date is required' });
                }

                if (employeeId) {
                    // Calculate salary for specific employee
                    const calculation = await calculateEmployeeSalary(employeeId, date);
                    res.status(200).json(calculation);
                } else {
                    // Calculate salary for all employees
                    const calculations = await calculateAllEmployeesSalary(date);
                    res.status(200).json(calculations);
                }
                break;
            default:
                res.setHeader('Allow', ['GET']);
                res.status(405).end(`Method ${method} Not Allowed`);
        }
    } catch (error) {
        console.error('Salary Calculation API Error:', error);
        res.status(500).json({ error: error.message });
    }
}
