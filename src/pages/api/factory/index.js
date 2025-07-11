// src/pages/api/factory/index.js

import { getAllFactories, createFactory } from '../../../services/factoryService';

export default async function handler(req, res) {
    const { method, body } = req;

    try {
        switch (method) {
            case 'GET':
                const factories = await getAllFactories();
                res.status(200).json(factories);
                break;
            case 'POST':
                const newFactory = await createFactory(body);
                res.status(201).json(newFactory);
                break;
            default:
                res.setHeader('Allow', ['GET', 'POST']);
                res.status(405).end(`Method ${method} Not Allowed`);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}