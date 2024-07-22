// src/pages/api/faclityWeight/index.js

import { getAllFactoryWeights, createFactoryWeight } from '../../../services/factoryWeightService';

export default async function handler(req, res) {
    const { method, body } = req;

    try {
        switch (method) {
            case 'GET':
                const factoryWeights = await getAllFactoryWeights();
                res.status(200).json(factoryWeights);
                break;
            case 'POST':
                const newFactoryWeight = await createFactoryWeight(body);
                res.status(201).json(newFactoryWeight);
                break;
            default:
                res.setHeader('Allow', ['GET', 'POST']);
                res.status(405).end(`Method ${method} Not Allowed`);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}