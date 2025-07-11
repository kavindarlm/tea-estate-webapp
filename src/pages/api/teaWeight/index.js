// src/pages/api/teaWeight/index.js

import { getAllTeaWeights, createTeaWeight } from '../../../services/teaWeightService';

export default async function handler(req, res) {
    const { method, body } = req;

    try {
        switch (method) {
            case 'GET':
                const teaWeights = await getAllTeaWeights();
                res.status(200).json(teaWeights);
                break;
            case 'POST':
                const newTeaWeight = await createTeaWeight(body);
                res.status(201).json(newTeaWeight);
                break;
            default:
                res.setHeader('Allow', ['GET', 'POST']);
                res.status(405).end(`Method ${method} Not Allowed`);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}