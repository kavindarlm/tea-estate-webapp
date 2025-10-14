import { useState, useEffect } from "react";
import { format } from "date-fns";
import { useToast } from "../reusable/Toaster";
import { getApiUrl } from "@/utils/api";

const API_BASE_URL = getApiUrl('/api');

const AddNote = ({
  onClose,
  onSave,
  selectedDate,
  existingNote,
  selectedHoliday,
}) => {
  const [note, setNote] = useState({
    cal_id: "",
    cal_date: "",
    cal_title: "",
    cal_note: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const { showSuccess, showError, showWarning } = useToast();

  useEffect(() => {
    if (selectedDate) {
      const formattedDate = format(selectedDate, "yyyy-MM-dd");
      if (existingNote) {
        // If there's an existing note, populate the form for editing
        setNote({
          cal_id: existingNote.cal_id,
          cal_date: formattedDate,
          cal_title: existingNote.cal_title,
          cal_note: existingNote.cal_note,
        });
        setIsEditing(true);
      } else {
        // If no existing note, prepare for new note creation
        setNote({
          cal_id: "",
          cal_date: formattedDate,
          cal_title: "",
          cal_note: "",
        });
        setIsEditing(false);
      }
    }
  }, [selectedDate, existingNote]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNote((prevNote) => ({
      ...prevNote,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!note.cal_title?.trim()) {
      showWarning("Please enter a note title");
      return;
    }

    if (!note.cal_date) {
      showWarning("Please select a date");
      return;
    }

    try {
      let response;
      if (isEditing) {
        // Update existing note
        response = await fetch(`${API_BASE_URL}/calendar/${note.cal_id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(localStorage.getItem("token") && {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            }),
          },
          body: JSON.stringify(note),
        });
      } else {
        // Create new note - exclude cal_id since it's auto-generated
        const { cal_id, ...noteData } = note;
        response = await fetch(`${API_BASE_URL}/calendar`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(localStorage.getItem("token") && {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            }),
          },
          body: JSON.stringify(noteData),
        });
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error(
          `Failed to ${isEditing ? "update" : "add"} note:`,
          response.status,
          errorData
        );
        showError(
          `Failed to ${isEditing ? "update" : "add"} note: ${
            errorData.error || "Unknown error"
          }`
        );
        return;
      }

      showSuccess(`Note "${note.cal_title}" ${isEditing ? "updated" : "added"} successfully!`);
      onSave && onSave(); // Trigger refresh
      onClose();
    } catch (error) {
      console.error(`Error ${isEditing ? "updating" : "adding"} note:`, error);
      showError(
        `Error ${isEditing ? "updating" : "adding"} note: ${error.message}`
      );
    }
  };

  const handleDelete = async () => {
    if (!isEditing || !note.cal_id) return;

    if (window.confirm("Are you sure you want to delete this note?")) {
      try {
        const response = await fetch(
          `${API_BASE_URL}/calendar/${note.cal_id}`,
          {
            method: "DELETE",
            ...(localStorage.getItem("token") && {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error("Failed to delete note:", response.status, errorData);
          showError(`Failed to delete note: ${errorData.error || "Unknown error"}`);
          return;
        }

        showSuccess(`Note "${note.cal_title}" deleted successfully!`);
        onSave && onSave(); // Trigger refresh
        onClose();
      } catch (error) {
        console.error("Error deleting note:", error);
        showError(`Error deleting note: ${error.message}`);
      }
    }
  };

  const handleCancelClick = () => {
    onClose();
  };

  return (
    <form
      className="space-y-4 px-4 sm:px-4 lg:px-8 sm:py-2 lg:py-4"
      onSubmit={handleSubmit}
    >
      <div className="border-b border-gray-900/10 pb-10">
        <h2 className="text-lg font-semibold leading-7 text-gray-900">
          {isEditing ? "Edit Note" : "Add Note"}
        </h2>
        <p className="mt-1 text-sm leading-6 text-gray-600">
          {isEditing ? "Edit note details" : "Enter note details"}
        </p>

        {selectedHoliday && (
          <div className="mt-2 p-3 bg-orange-50 border border-orange-200 rounded-md">
            <div className="flex items-center">
              <svg
                className="h-5 w-5 text-orange-400 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <p className="text-sm font-medium text-orange-600">Holiday</p>
                <p className="text-sm text-orange-400">
                  {selectedHoliday.name}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">
          <div className="sm:col-span-full">
            <label
              htmlFor="cal_date"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
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
            <label
              htmlFor="cal_title"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
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
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2"
              />
            </div>
          </div>

          <div className="col-span-full">
            <label
              htmlFor="cal_note"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
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

      <div className="mt-2 flex items-center justify-between gap-x-6">
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
            {isEditing ? "Update Note" : "Add Note"}
          </button>
        </div>
        {isEditing && (
          <div>
            <button
              type="button"
              className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
              onClick={handleDelete}
            >
              Delete Note
            </button>
          </div>
        )}
      </div>
    </form>
  );
};

export default AddNote;