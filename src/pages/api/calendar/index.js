// src/pages/api/calendar/index.js

const { getAllCalendars, getCalendarsByUser, createCalendar } = require('../../../services/calendarService');
const { getUserFromToken } = require('../../../utils/auth');
const { User } = require('../../../models');

export default async function handler(req, res) {
    const { method, body, query } = req;

    try {
        switch (method) {
            case 'GET':
                const { userId } = query;
                let calendars;
                
                // If userId is provided in query, use it (for admin access)
                // Otherwise, try to get user from token
                if (userId) {
                    calendars = await getCalendarsByUser(userId);
                } else {
                    const user = getUserFromToken(req);
                    if (user) {
                        calendars = await getCalendarsByUser(user.userId);
                    } else {
                        // For demo purposes, return all calendars if no auth
                        // In production, you might want to require authentication
                        calendars = await getAllCalendars();
                    }
                }
                
                res.status(200).json(calendars);
                break;
            case 'POST':
                // Add user ID to the calendar data
                const user = getUserFromToken(req);
                let createdBy = 1; // Default fallback
                
                if (user && user.userId) {
                    // Verify that the user exists in the database
                    const userExists = await User.findByPk(user.userId);
                    if (userExists && !userExists.deleted) {
                        createdBy = user.userId;
                    } else {
                        console.warn(`User ID ${user.userId} does not exist or is deleted, using default user`);
                    }
                }
                
                const calendarData = {
                    ...body,
                    created_by: createdBy
                };
                
                const newCalendar = await createCalendar(calendarData);
                res.status(201).json(newCalendar);
                break;
            default:
                res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
                res.status(405).end(`Method ${method} Not Allowed`);
        }
    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ error: error.message });
    }
}