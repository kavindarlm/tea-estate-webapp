// src/pages/api/salary/config.js

import { getAllSalaryConfigs, getActiveSalaryConfig, createSalaryConfig, updateSalaryConfig } from '../../../services/salaryService';

export default async function handler(req, res) {
    const { method, body, query } = req;

    try {
        switch (method) {
            case 'GET':
                if (query.active === 'true') {
                    const activeConfig = await getActiveSalaryConfig();
                    res.status(200).json(activeConfig);
                } else {
                    const configs = await getAllSalaryConfigs();
                    res.status(200).json(configs);
                }
                break;
            case 'POST':
                const newConfig = await createSalaryConfig(body);
                res.status(201).json(newConfig);
                break;
            case 'PUT':
                if (!query.id) {
                    return res.status(400).json({ error: 'Config ID is required' });
                }
                const updatedConfig = await updateSalaryConfig(query.id, body);
                res.status(200).json(updatedConfig);
                break;
            default:
                res.setHeader('Allow', ['GET', 'POST', 'PUT']);
                res.status(405).end(`Method ${method} Not Allowed`);
        }
    } catch (error) {
        console.error('Salary Config API Error:', error);
        res.status(500).json({ error: error.message });
    }
}
