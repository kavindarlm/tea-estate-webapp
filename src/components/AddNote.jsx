import { useState, useEffect } from 'react';
import { format } from 'date-fns'; // Import format from date-fns

const AddNote = ({ onClose, onSave, selectedDate }) => {
    const [note, setNote] = useState({
        cal_date: '',
        cal_title: '',
        cal_note: ''
    });

    useEffect(() => {
        if (selectedDate) {
            setNote((prevNote) => ({
                ...prevNote,
                cal_date: format(selectedDate, 'yyyy-MM-dd') // Format the date to YYYY-MM-DD using date-fns
            }));
        }
    }, [selectedDate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNote((prevNote) => ({
            ...prevNote,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3000/api/calendar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(note)
            });
            if (!response.ok) {
                console.error('Failed to add note:', response.status);
                return;
            }
            alert('Note added successfully');
            onClose();
        } catch (error) {
            console.error('Error adding note:', error);
        }
    };

    const handleCancelClick = () => {
        onClose();
    };

    return (
        <form className="space-y-8 px-4 sm:px-4 lg:px-8 sm:py-2 lg:py-4" onSubmit={handleSubmit}>
            <div className="border-b border-gray-900/10 pb-10">
                <h2 className="text-lg font-semibold leading-7 text-gray-900">Add Note</h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">Enter note details</p>

                <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
                    <div className="sm:col-span-full">
                        <label htmlFor="cal_date" className="block text-sm font-medium leading-6 text-gray-900">
                            Date
                        </label>
                        <div className="mt-1">
                            <input
                                type="text"
                                name="cal_date"
                                id="cal_date"
                                value={note.cal_date}
                                onChange={handleChange}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2"
                            />
                        </div>
                    </div>

                    <div className="sm:col-span-full">
                        <label htmlFor="cal_title" className="block text-sm font-medium leading-6 text-gray-900">
                            Note Title
                        </label>
                        <div className="mt-1">
                            <input
                                type="text"
                                name="cal_title"
                                id="cal_title"
                                autoComplete="note-title"
                                value={note.cal_title}
                                onChange={handleChange}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2"
                            />
                        </div>
                    </div>

                    <div className="col-span-full">
                        <label htmlFor="cal_note" className="block text-sm font-medium leading-6 text-gray-900">
                            Note Content
                        </label>
                        <div className="mt-1">
                            <textarea
                                name="cal_note"
                                id="cal_note"
                                autoComplete="note-content"
                                value={note.cal_note}
                                onChange={handleChange}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-6 flex items-center justify-between gap-x-6">
                <div className="flex items-center gap-x-6">
                    <button
                        type="button"
                        className="text-sm font-semibold leading-6 text-gray-900"
                        onClick={handleCancelClick}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="rounded-md bg-buttonColor px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-buttonColor"
                    >
                        Add Note
                    </button>
                </div>
            </div>
        </form>
    );
};

export default AddNote;