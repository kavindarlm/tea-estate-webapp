import React, { useState, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, isToday } from 'date-fns';
import axios from 'axios';
import Modal from './Modal'; // Import Modal component
import AddNote from './AddNote'; // Import AddNote component


const Calendar = () => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [notes, setNotes] = useState({});
    const [noteText, setNoteText] = useState('');
    const [holidays, setHolidays] = useState([]);
    const [isAddNoteModalOpen, setIsAddNoteModalOpen] = useState(false); // State to manage AddNote modal visibility

    useEffect(() => {
        fetchHolidays();
    }, [currentMonth]);

    const fetchHolidays = async () => {
        const apiKey = 'koGMonCwz4UYVUjLMywpmV2Vc1CgaQDe';
        const country = 'LK'; // Change to your country code
        const year = format(currentMonth, 'yyyy');
        const month = format(currentMonth, 'MM');

        try {
            const response = await axios.get(`https://calendarific.com/api/v2/holidays?api_key=${apiKey}&country=${country}&year=${year}&month=${month}`);
            const holidays = response.data.response.holidays.map(holiday => ({
                date: holiday.date.iso,
                name: holiday.name
            }));
            setHolidays(holidays);
        } catch (error) {
            console.error('Error fetching holidays:', error);
        }
    };

    const renderHeader = () => {
        const dateFormat = 'MMMM yyyy';

        return (
            <div className="flex justify-between items-center mb-2">
                <div>
                    <button onClick={prevMonth} className="px-2 py-1 sm:px-4 sm:py-2 bg-gray-200 rounded-full h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 flex items-center justify-center">
                        <ChevronLeftIcon className="h-5 w-5 sm:h-6 sm:w-6 text-gray-800" />
                    </button>
                </div>
                <div className="text-lg sm:text-xl font-bold text-green-900">{format(currentMonth, dateFormat)}</div>
                <div>
                    <button onClick={nextMonth} className="px-2 py-1 sm:px-4 sm:py-2 bg-gray-200 rounded-full h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 flex items-center justify-center">
                        <ChevronRightIcon className="h-5 w-5 sm:h-6 sm:w-6 text-gray-800" />
                    </button>
                </div>
            </div>
        );
    };

    const renderDays = () => {
        const days = [];
        const dateFormat = 'EEE'; // Use 'EEE' for abbreviated day names
        const startDate = startOfWeek(currentMonth);

        for (let i = 0; i < 7; i++) {
            days.push(
                <div className="text-center font-semibold text-green-600 text-xs sm:text-base" key={i}>
                    {format(addDays(startDate, i), dateFormat).toUpperCase()} {/* Convert to uppercase */}
                </div>
            );
        }

        return <div className="grid grid-cols-7 mb-4 text-black">{days}</div>;
    };

    const renderCells = () => {
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart);
        const endDate = endOfWeek(monthEnd);

        const rows = [];
        let days = [];
        let day = startDate;
        let formattedDate = '';

        while (day <= endDate) {
            for (let i = 0; i < 7; i++) {
                formattedDate = format(day, 'yyyy-MM-dd');
                const cloneDay = day;
                const holiday = holidays.find(holiday => holiday.date === formattedDate);

                days.push(
                    <div
                        className={`p-1 sm:p-2 md:p-4 text-center cursor-pointer flex flex-col items-center justify-center border border-gray-200 ${!isSameMonth(day, monthStart) ? 'text-gray-500' : ''} ${isSameDay(day, selectedDate) ? 'bg-gray-200' : ''
                            } ${holiday ? '' : ''}`}
                        key={day}
                        onClick={() => onDateClick(cloneDay)}
                    >
                        <span className={`text-xs sm:text-base text-black ${isToday(day) ? 'bg-green-500 text-white rounded-full h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 flex items-center justify-center' : ''}`}>
                            {format(day, 'd')}
                        </span>
                        {holiday && <div className="mt-1 text-xs text-white bg-amber-600 rounded px-1 sm:px-2 py-1">{holiday.name}</div>}
                        {notes[formattedDate] && (
                            <div className="mt-1 text-xs text-red-500">{notes[formattedDate]}</div>
                        )}
                    </div>
                );
                day = addDays(day, 1);
            }
            rows.push(
                <div className="grid grid-cols-7 gap-1 sm:gap-4" key={day}>
                    {days}
                </div>
            );
            days = [];
        }

        return <div>{rows}</div>;
    };

    const onDateClick = (day) => {
        setSelectedDate(day);
        setNoteText(notes[format(day, 'yyyy-MM-dd')] || '');
        setIsAddNoteModalOpen(true); // Show the AddNote modal
    };

    const handleNoteSave = (newNote) => {
        setNotes({
            ...notes,
            [format(selectedDate, 'yyyy-MM-dd')]: newNote,
        });
        setNoteText('');
        setSelectedDate(null);
        setIsAddNoteModalOpen(false); // Hide the AddNote modal
    };

    const handleCloseAddNoteModal = () => {
        setIsAddNoteModalOpen(false); // Hide the AddNote modal
        setSelectedDate(null);
    };

    const prevMonth = () => {
        setCurrentMonth(addDays(currentMonth, -30));
    };

    const nextMonth = () => {
        setCurrentMonth(addDays(currentMonth, 30));
    };

    return (
        <div id="calendar" className='min-h-screen'>
            <div className="py-5 lg:pl-72">
                <div className="px-4 sm:px-6 lg:px-8">
                    <div className="pt-1">
                        <h1 className="text-lg font-semibold text-gray-900">Calendar</h1>
                        <p className="mt-2 text-sm text-gray-500">
                            Welcome to the Calendar. Here you can view all the important dates and events.
                        </p>
                    </div>
                    <div className="mt-8">
                        {renderHeader()}
                        <div className='mt-8'>
                            {renderDays()}
                        </div>
                        {renderCells()}
                        <Modal isOpen={isAddNoteModalOpen} onClose={handleCloseAddNoteModal}>
                            <AddNote
                                onClose={handleCloseAddNoteModal}
                                onSave={handleNoteSave}
                                selectedDate={selectedDate} // Pass the selected date to AddNote component
                            />
                            {/* {console.log('selectedDate:', selectedDate)} */}
                        </Modal>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Calendar;