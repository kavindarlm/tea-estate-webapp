import { Calendar } from "../../models";

export const getAllCalendars = async () => {
    return await Calendar.findAll();
}   

export const getCalendarsByUser = async (userId) => {
    return await Calendar.findAll({ 
        where: { created_by: userId } 
    });
}

export const getCalendarByID = async (id) => {
    return await Calendar.findByPk(id);
}

export const getCalendarByDateAndUser = async (date, userId) => {
    return await Calendar.findOne({ 
        where: { 
            cal_date: date,
            created_by: userId 
        } 
    });
}

export const createCalendar = async (calendarData) => {
    return await Calendar.create(calendarData);
}

export const updateCalendar = async (id, calendarData) => {
    const calendar = await Calendar.findByPk(id);
    if (!calendar) throw new Error('Calendar not found');
    return await calendar.update(calendarData);
}

export const deleteCalendar = async (id) => {
    const calendar = await Calendar.findByPk(id);
    if (!calendar) throw new Error('Calendar not found');
    return await calendar.destroy();
}