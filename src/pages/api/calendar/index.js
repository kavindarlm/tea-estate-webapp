// src/pages/api/calendar/index.js

import { getAllCalendars, createCalendar } from '../../../services/calendarService';

export default async function handler(req, res) {
    const { method, body, query } = req;

    try {
        switch (method) {
            case 'GET':
                const calendars = await getAllCalendars();
                res.status(200).json(calendars);
                break;
            case 'POST':
                const newCalendar = await createCalendar(body);
                res.status(201).json(newCalendar);
                break;
            default:
                res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
                res.status(405).end(`Method ${method} Not Allowed`);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}