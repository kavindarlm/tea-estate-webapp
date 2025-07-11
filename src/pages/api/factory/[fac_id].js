// src/pages/api/factory/[fac_id].js

import { getFactoryByID, updateFactory, deleteFactory } from '../../../services/factoryService';

export default async function handler(req, res) {
    const { method, body, query } = req;
    const { fac_id } = query;

    try {
        switch (method) {
            case 'GET':
                const factory = await getFactoryByID(fac_id);
                if (!factory) {
                    res.status(404).json({ error: 'Factory not found' });
                } else {
                    res.status(200).json(factory);
                }
                break;
            case 'PUT':
                const updatedFactory = await updateFactory(fac_id, body);
                res.status(200).json(updatedFactory);
                break;
            case 'DELETE':
                await deleteFactory(fac_id);
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