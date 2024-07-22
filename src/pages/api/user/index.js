// src/pages/api/user/index.js

import { getAllUsers, getUserByEmail, createUser } from '../../../services/userService';

export default async function handler(req, res) {
    const { method, body, query } = req;

    try {
        switch (method) {
            case 'GET':
                if (query.email) {
                    const user = await getUserByEmail(query.email);
                    res.status(200).json(user);
                } else {
                    console.log("Get all users");
                    const users = await getAllUsers();
                    res.status(200).json(users);
                }
                break;
            case 'POST':
                const newUser = await createUser(body);
                res.status(201).json(newUser);
                break;
            default:
                res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
                res.status(405).end(`Method ${method} Not Allowed`);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
