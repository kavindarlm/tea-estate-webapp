// src/pages/api/user/[user_id].js

import { getUserByID, updateUser, deleteUser } from '../../../services/userService';

export default async function handler(req, res) {
    const { method, body, query } = req;
    const { user_id } = query;

    try {
        switch (method) {
            case 'GET':
                const user = await getUserByID(user_id);
                if (!user) {
                    res.status(404).json({ error: 'User not found' });
                } else {
                    res.status(200).json(user);
                }
                break;
            case 'PUT':
                const updatedUser = await updateUser(user_id, body);
                res.status(200).json(updatedUser);
                break;
            case 'DELETE':
                await deleteUser(user_id);
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
