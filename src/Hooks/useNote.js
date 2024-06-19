import { useContext } from "react";

import { NoteContext } from "../Context/NoteContext";

export const useNote = () => {
  const context = useContext(NoteContext);
  if (context === undefined) {
    throw new Error("useNotes must be used within a NoteProvider");
  }
  return context;
};
