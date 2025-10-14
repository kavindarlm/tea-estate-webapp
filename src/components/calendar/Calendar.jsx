import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  isToday,
  addMonths,
  subMonths,
} from "date-fns";
import axios from "axios";
import Modal from "../Modal";
import AddNote from "./AddNote";
import { getApiUrl } from "@/utils/api";

const API_BASE_URL = getApiUrl('/api');
const HOLIDAYS_API_KEY = "koGMonCwz4UYVUjLMywpmV2Vc1CgaQDe";
const COUNTRY_CODE = "LK";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [calendarNotes, setCalendarNotes] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [isAddNoteModalOpen, setIsAddNoteModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [selectedHoliday, setSelectedHoliday] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(new Date().getMonth());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);
  }, []);

  const monthKey = useMemo(() => {
    return `${format(currentMonth, "yyyy-MM")}`;
  }, [currentMonth]);

  // Fetch calendar notes with error handling
  const fetchCalendarNotes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      const headers = { "Content-Type": "application/json" };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/calendar`, { headers });

      if (response.ok) {
        const notes = await response.json();
        setCalendarNotes(notes);
      } else {
        throw new Error(`Failed to fetch calendar notes: ${response.status}`);
      }
    } catch (error) {
      console.error("Error fetching calendar notes:", error);
      setError("Failed to load calendar notes");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch holidays with error handling
  const fetchHolidays = useCallback(async () => {
    const year = format(currentMonth, "yyyy");
    const month = format(currentMonth, "MM");

    try {
      const response = await axios.get(
        `https://calendarific.com/api/v2/holidays?api_key=${HOLIDAYS_API_KEY}&country=${COUNTRY_CODE}&year=${year}&month=${month}`
      );
      
      const holidays = response.data.response.holidays.map((holiday) => ({
        date: holiday.date.iso,
        name: holiday.name,
      }));
      setHolidays(holidays);
    } catch (error) {
      console.error("Error fetching holidays:", error);
    }
  }, [monthKey]);

  useEffect(() => {
    fetchHolidays();
    fetchCalendarNotes();
  }, [fetchHolidays, fetchCalendarNotes]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDatePicker && !event.target.closest(".date-picker-container")) {
        setShowDatePicker(false);
        setSelectedYear(currentMonth.getFullYear());
        setSelectedMonthIndex(currentMonth.getMonth());
      }
    };

    if (showDatePicker) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [showDatePicker, currentMonth]);

  // Event handlers
  const handleDatePickerToggle = useCallback(() => {
    setShowDatePicker(prev => !prev);
    if (!showDatePicker) {
      setSelectedYear(currentMonth.getFullYear());
      setSelectedMonthIndex(currentMonth.getMonth());
    }
  }, [showDatePicker, currentMonth]);

  const handleDatePickerApply = useCallback(() => {
    const newDate = new Date(selectedYear, selectedMonthIndex, 1);
    setCurrentMonth(newDate);
    setShowDatePicker(false);
  }, [selectedYear, selectedMonthIndex]);

  const prevMonth = useCallback(() => {
    setCurrentMonth(prev => subMonths(prev, 1));
  }, []);

  const nextMonth = useCallback(() => {
    setCurrentMonth(prev => addMonths(prev, 1));
  }, []);

  // Create lookup maps for better performance
  const holidayMap = useMemo(() => {
    const map = new Map();
    holidays.forEach(holiday => {
      map.set(holiday.date, holiday);
    });
    return map;
  }, [holidays]);

  const notesMap = useMemo(() => {
    const map = new Map();
    calendarNotes.forEach(note => {
      const noteDate = new Date(note.cal_date);
      const formattedDate = format(noteDate, "yyyy-MM-dd");
      map.set(formattedDate, note);
    });
    return map;
  }, [calendarNotes]);

  const onDateClick = useCallback((day) => {
    const formattedDate = format(day, "yyyy-MM-dd");
    const existingNote = calendarNotes.find((note) => {
      const noteDate = new Date(note.cal_date);
      return format(noteDate, "yyyy-MM-dd") === formattedDate;
    });

    // Check if the clicked date has a holiday
    const holiday = holidayMap.get(formattedDate);

    setSelectedDate(day);
    setSelectedNote(existingNote || null);
    setSelectedHoliday(holiday || null);
    setIsAddNoteModalOpen(true);
  }, [calendarNotes, holidayMap]);

  const handleNoteSave = useCallback(() => {
    fetchCalendarNotes();
    setSelectedDate(null);
    setSelectedNote(null);
    setSelectedHoliday(null);
    setIsAddNoteModalOpen(false);
  }, [fetchCalendarNotes]);

  const handleCloseAddNoteModal = useCallback(() => {
    setIsAddNoteModalOpen(false);
    setSelectedDate(null);
    setSelectedNote(null);
    setSelectedHoliday(null);
  }, []);

  // Optimized render functions
  const renderHeader = useCallback(() => {
    const dateFormat = "MMMM yyyy";

    return (
      <div className="relative">
        <div className="flex justify-between items-center mb-2">
          <div>
            <button
              onClick={prevMonth}
              className="px-2 py-1 sm:px-4 sm:py-2 bg-gray-200 rounded-full h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 flex items-center justify-center"
              aria-label="Previous month"
            >
              <ChevronLeftIcon className="h-5 w-5 sm:h-6 sm:w-6 text-gray-800" />
            </button>
          </div>
          <div className="relative date-picker-container">
            <button
              onClick={handleDatePickerToggle}
              className="text-lg sm:text-xl font-bold text-green-700 hover:text-green-700 cursor-pointer px-4 py-2 rounded-md bg-green-50 hover:bg-green-100 transition-colors"
            >
              {format(currentMonth, dateFormat)}
            </button>

            {showDatePicker && (
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-50 p-4 min-w-[280px]">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Year
                    </label>
                    <select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                      className="w-full p-2 border text-gray-600 border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                      {years.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Month
                    </label>
                    <select
                      value={selectedMonthIndex}
                      onChange={(e) => setSelectedMonthIndex(parseInt(e.target.value))}
                      className="w-full p-2 text-gray-600 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                      {MONTHS.map((month, index) => (
                        <option key={index} value={index}>
                          {month}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex justify-end space-x-2 pt-2">
                    <button
                      onClick={handleDatePickerApply}
                      className="px-3 py-1 text-sm text-white bg-green-600 hover:bg-green-700 rounded-md"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div>
            <button
              onClick={nextMonth}
              className="px-2 py-1 sm:px-4 sm:py-2 bg-gray-200 rounded-full h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 flex items-center justify-center"
              aria-label="Next month"
            >
              <ChevronRightIcon className="h-5 w-5 sm:h-6 sm:w-6 text-gray-800" />
            </button>
          </div>
        </div>
      </div>
    );
  }, [currentMonth, showDatePicker, selectedYear, selectedMonthIndex, years, prevMonth, nextMonth, handleDatePickerToggle, handleDatePickerApply]);

  const renderDays = useCallback(() => {
    const days = [];
    const dateFormat = "EEE";
    const startDate = startOfWeek(currentMonth);

    for (let i = 0; i < 7; i++) {
      days.push(
        <div
          className="text-center font-semibold text-green-600 text-xs sm:text-base"
          key={i}
        >
          {format(addDays(startDate, i), dateFormat).toUpperCase()}
        </div>
      );
    }

    return <div className="grid grid-cols-7 mb-4 text-black">{days}</div>;
  }, [currentMonth]);

  const renderCells = useCallback(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const formattedDate = format(day, "yyyy-MM-dd");
        const cloneDay = day;
        const holiday = holidayMap.get(formattedDate);
        const calendarNote = notesMap.get(formattedDate);

        const cellClasses = [
          "p-1 sm:p-2 md:p-4 text-center cursor-pointer flex flex-col items-center justify-center border border-gray-200 relative",
          !isSameMonth(day, monthStart) ? "text-gray-500" : "",
          isSameDay(day, selectedDate) ? "bg-gray-200" : "",
          holiday ? "bg-orange-50 border-orange-300" : "",
          calendarNote ? "bg-blue-50 border-blue-300" : "",
        ].filter(Boolean).join(" ");

        const dateClasses = [
          "text-xs sm:text-base text-black",
          isToday(day)
            ? "bg-green-500 text-white rounded-full h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 flex items-center justify-center"
            : "",
        ].filter(Boolean).join(" ");

        days.push(
          <div
            className={cellClasses}
            key={day.getTime()}
            onClick={() => onDateClick(cloneDay)}
          >
            {calendarNote && (
              <StarIcon className="absolute top-1 right-1 h-3 w-3 sm:h-4 sm:w-4 text-blue-600 fill-blue-600" />
            )}
            <span className={dateClasses}>
              {format(day, "d")}
            </span>
            {holiday && (
              <div className="mt-1 text-xs text-orange-500 bg-orange-200/50 rounded py-1 px-1 max-w-full truncate">
                {holiday.name}
              </div>
            )}
            {calendarNote && (
              <div className="mt-1 text-xs text-blue-600 bg-blue-100 rounded px-1 py-1 max-w-full truncate">
                {calendarNote.cal_title}
              </div>
            )}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7 gap-1 sm:gap-4" key={day.getTime()}>
          {days}
        </div>
      );
      days = [];
    }

    return <div>{rows}</div>;
  }, [currentMonth, selectedDate, holidayMap, notesMap, onDateClick]);

  return (
    <div id="calendar" className="flex-1 overflow-auto">
      <div className="py-5">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="pt-1">
            <h1 className="text-lg font-semibold text-gray-900">Calendar</h1>
            <p className="mt-2 text-sm text-gray-500">
              Welcome to the Calendar. Here you can view all the important dates
              and events.
            </p>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="mt-8">
            {renderHeader()}
            <div className="mt-8">{renderDays()}</div>
            
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
              </div>
            ) : (
              renderCells()
            )}

            <Modal
              isOpen={isAddNoteModalOpen}
              onClose={handleCloseAddNoteModal}
            >
              <AddNote
                onClose={handleCloseAddNoteModal}
                onSave={handleNoteSave}
                selectedDate={selectedDate}
                existingNote={selectedNote}
                selectedHoliday={selectedHoliday}
              />
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
