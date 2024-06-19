import { useState } from "react";

import { useNote } from "../Hooks/useNote";

import NoteCard from "./NoteCard";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./Pagination";

import Spinner from "./Spinner";

function Note() {
  const { notes, initialFetchLoading } = useNote();

  const [currentPage, setCurrentPage] = useState(1);

  const [itemsPerPage] = useState(6);

  // Sorting isPinned and if not pinned sort dates. (Date is already pre sorted in context)
  const sortedNotes = notes.sort((a, b) => {
    if (a.isPinned !== b.isPinned) {
      return a.isPinned ? -1 : 1;
    }
    return new Date(b.created_at) - new Date(a.created_at);
  });

  const indexOfLastNote = currentPage * itemsPerPage;

  const indexOfFirstNote = indexOfLastNote - itemsPerPage;

  const currentNotes = sortedNotes.slice(indexOfFirstNote, indexOfLastNote);

  const totalPages = Math.ceil(sortedNotes.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  if (initialFetchLoading) {
    return (
      <div className="">
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      {sortedNotes && sortedNotes.length > 0 && (
        <div>
          <div className="flex flex-col items-center justify-center gap-y-10">
            {currentNotes.map((note) => (
              <NoteCard noteData={note} key={note.id} />
            ))}
          </div>
          {sortedNotes && sortedNotes.length > 1 && (
            <div className="mt-4 flex justify-center">
              <Pagination>
                <PaginationContent className="space-x-4 my-6">
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={handlePrevious}
                      className="bg-neutral-600 hover:bg-neutral-700 hover:text-slate-100 transition-all ease-in hover:cursor-pointer duration-100"
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, index) => (
                    <PaginationItem key={index}>
                      <PaginationLink
                        onClick={() => handlePageChange(index + 1)}
                        isActive={currentPage === index + 1}
                        className="bg-neutral-600 hover:bg-neutral-700 hover:text-slate-100 transition-all ease-in hover:cursor-pointer duration-100"
                      >
                        {index + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      onClick={handleNext}
                      className="bg-neutral-600 hover:bg-neutral-700 hover:text-slate-100 transition-all ease-in hover:cursor-pointer duration-100"
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Note;
