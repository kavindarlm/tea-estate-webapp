// src/pages/api/calendar/[id].js

const { getCalendarByID, updateCalendar, deleteCalendar } = require('../../../services/calendarService');
const { getUserFromToken } = require('../../../utils/auth');

export default async function handler(req, res) {
    const { method, body, query } = req;
    const { id } = query;

    try {
        switch (method) {
            case 'GET':
                const calendar = await getCalendarByID(id);
                if (!calendar) {
                    return res.status(404).json({ error: 'Calendar not found' });
                }
                
                // Check if user owns this calendar entry
                const user = getUserFromToken(req);
                if (user && calendar.created_by !== user.userId) {
                    return res.status(403).json({ error: 'Access denied' });
                }
                
                res.status(200).json(calendar);
                break;
            case 'PUT':
                const updateUser = getUserFromToken(req);
                const existingCalendar = await getCalendarByID(id);
                
                if (!existingCalendar) {
                    return res.status(404).json({ error: 'Calendar not found' });
                }
                
                // Check if user owns this calendar entry
                if (updateUser && existingCalendar.created_by !== updateUser.userId) {
                    return res.status(403).json({ error: 'Access denied' });
                }
                
                const updatedCalendar = await updateCalendar(id, body);
                res.status(200).json(updatedCalendar);
                break;
            case 'DELETE':
                const deleteUser = getUserFromToken(req);
                const calendarToDelete = await getCalendarByID(id);
                
                if (!calendarToDelete) {
                    return res.status(404).json({ error: 'Calendar not found' });
                }
                
                // Check if user owns this calendar entry
                if (deleteUser && calendarToDelete.created_by !== deleteUser.userId) {
                    return res.status(403).json({ error: 'Access denied' });
                }
                
                await deleteCalendar(id);
                res.status(204).end();
                break;
            default:
                res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
                res.status(405).end(`Method ${method} Not Allowed`);
        }
    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ error: error.message });
    }
}
