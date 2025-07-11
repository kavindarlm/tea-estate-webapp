// src/pages/api/factoryWeight/[fac_weight_id].js

import { getFactoryWeightByID, updateFactoryWeight, deleteFactoryWeight } from '../../../services/factoryWeightService';

export default async function handler(req, res) {
    const { method, body, query } = req;
    const { fac_weight_id } = query;

    try {
        switch (method) {
            case 'GET':
                const factoryWeight = await getFactoryWeightByID(fac_weight_id);
                if (!factoryWeight) {
                    res.status(404).json({ error: 'Factory Weight not found' });
                } else {
                    res.status(200).json(factoryWeight);
                }
                break;
            case 'PUT':
                const updatedFactoryWeight = await updateFactoryWeight(fac_weight_id, body);
                res.status(200).json(updatedFactoryWeight);
                break;
            case 'DELETE':
                await deleteFactoryWeight(fac_weight_id);
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