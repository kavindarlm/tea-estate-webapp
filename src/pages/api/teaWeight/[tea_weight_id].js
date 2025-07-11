// src/pages/api/teaWeight/[tea_weight_id].js

import { getTeaWeightByID, updateTeaWeight, deleteTeaWeight } from '../../../services/teaWeightService';

export default async function handler(req, res) {
    const { method, body, query } = req;
    const { tea_weight_id } = query;

    try {
        switch (method) {
            case 'GET':
                const teaWeight = await getTeaWeightByID(tea_weight_id);
                if (!teaWeight) {
                    res.status(404).json({ error: 'Tea Weight not found' });
                } else {
                    res.status(200).json(teaWeight);
                }
                break;
            case 'PUT':
                const updatedTeaWeight = await updateTeaWeight(tea_weight_id, body);
                res.status(200).json(updatedTeaWeight);
                break;
            case 'DELETE':
                await deleteTeaWeight(tea_weight_id);
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