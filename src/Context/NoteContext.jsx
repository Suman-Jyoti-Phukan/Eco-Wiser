/* eslint-disable react/prop-types */
import { createContext, useEffect, useState } from "react";

import { useFetchData } from "../Services/apiNotes";

export const NoteContext = createContext();

// Centralized zone for managing global state.
export const NoteProvider = ({ children }) => {
  const { fetchData, isLoading: initialFetchLoading } = useFetchData("Note");

  const [notes, setNotes] = useState([]);

  const [isPinnable, setIsPinnable] = useState(false);

  const addNote = (newNote) => {
    setNotes([...notes, newNote]);
  };

  const updateNote = (id, key, value) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === id ? { ...note, [key]: value } : note
      )
    );
  };

  const removeNote = (id) => {
    setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
  };

  const removeImage = (id, imageIndex) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === id
          ? {
              ...note,
              images: note.images.filter((_, index) => index !== imageIndex),
            }
          : note
      )
    );
  };

  function canPinAnotherNote(notes) {
    // Count the number of pinned notes
    const pinnedNotesCount = notes.reduce((count, note) => {
      return note.isPinned ? count + 1 : count;
    }, 0);

    // Allow pinning if there are less than 2 pinned notes
    return pinnedNotesCount < 2;
  }

  // Fetch Server State At Initial Mount
  useEffect(() => {
    const fetchNotes = async () => {
      const notes = await fetchData();
      const sortedNotes = notes.sort((a, b) => {
        // First sort by isPinned (pinned notes first)
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;

        // If both are pinned or both are not pinned, sort by created_at
        return new Date(b.created_at) - new Date(a.created_at);
      });
      setNotes(sortedNotes);
    };

    fetchNotes();
  }, []);

  useEffect(() => {
    const value = canPinAnotherNote(notes);
    setIsPinnable(value);
    console.log(value);
  }, [notes]);

  // Context value
  const value = {
    notes,
    isPinnable,
    addNote,
    updateNote,
    removeImage,
    removeNote,
    initialFetchLoading,
  };

  return <NoteContext.Provider value={value}>{children}</NoteContext.Provider>;
};
