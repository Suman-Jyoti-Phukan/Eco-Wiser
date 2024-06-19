/* eslint-disable react/prop-types */
// import { useEffect, useRef, useState } from "react";

// import { useNote } from "../Hooks/useNote";

// import { useUpdateData } from "../Server/apiNotes";

// import NoteCardContent from "./NoteCardContent";

// import useDebounce from "../Hooks/useDebounce";

// import useCustomToast from "@/Hooks/useCustomToast";

// function NoteCard({ noteData }) {
//   const { updateNote } = useNote();

//   const { errorToast, Toaster } = useCustomToast();

//   const { updateData, error: updateError } = useUpdateData("Note");

//   const debounce = useDebounce();

//   const debouncedUpdateData = debounce(300, async (id, updates) => {
//     try {
//       await updateData(id, updates);
//     } catch (error) {
//       errorToast("Failed To Update");
//     }
//   });

//   const { id, title, _tag, note, images, image_url } = noteData;

//   const [isExpanded] = useState(true);

//   const [isDialogActive, setIsDialogActive] = useState(false);

//   const editableTitleDiv = useRef(null);

//   const editableNoteDiv = useRef(null);

//   const editableTaglineDiv = useRef(null);

//   const handleTitleUpdate = async (e) => {
//     const content = e.target.innerText;
//     updateNote(id, "title", content);
//     debouncedUpdateData(id, { title: content });
//   };

//   const handleNoteUpdate = async (e) => {
//     const content = e.target.innerText;
//     updateNote(id, "note", content);
//     debouncedUpdateData(id, { note: content });
//   };

//   const handleTagUpdate = async (e) => {
//     const content = e.target.innerText;
//     updateNote(id, "_tag", content);
//     debouncedUpdateData(id, { _tag: content });
//   };

//   const toggleDialog = (e) => {
//     e.stopPropagation();
//     setIsDialogActive((cur) => !cur);
//   };

//   // Need to manually handle the text node of EditableDiv.
//   useEffect(() => {
//     const updateContent = () => {
//       if (editableTitleDiv.current) {
//         editableTitleDiv.current.textContent = title;
//       }
//       if (editableNoteDiv.current) {
//         editableNoteDiv.current.textContent = note;
//       }
//       if (editableTaglineDiv.current) {
//         editableTaglineDiv.current.textContent = _tag;
//       }
//     };

//     updateContent();
//   }, [title, note, _tag]);

//   // Manually overriding the default overflow.
//   useEffect(() => {
//     if (isDialogActive) {
//       // document.body.style.overflow = "hidden";
//     } else {
//       document.body.style.overflow = "auto";
//     }

//     return () => {
//       document.body.style.overflow = "auto";
//     };
//   }, [isDialogActive]);

//   const dialogClass = `z-50 absolute top-0 left-0 transform scale-110`;

//   const isDivEditable = isDialogActive ? true : false;

//   if (updateError) {
//     errorToast("Cloud Upload Failed.");
//   }

//   return (
//     <>
//       <div
//         className={`relative border border-slate-300/30 rounded-lg p-4 w-[34.375rem] transition-all duration-200 ease-in
//         ${isDialogActive ? dialogClass : ""}
//         }`}
//         onClick={() => setIsDialogActive(true)}
//       >
//         <div className={`mb-4`}>
//           <NoteCardContent
//             editableTitleDiv={editableTitleDiv}
//             editableNoteDiv={editableNoteDiv}
//             editableTaglineDiv={editableTaglineDiv}
//             isExpanded={isExpanded}
//             isEditable={isDivEditable}
//             handleTitleUpdate={handleTitleUpdate}
//             handleNoteUpdate={handleNoteUpdate}
//             handleTagUpdate={handleTagUpdate}
//             image_url={image_url}
//             images={images}
//             id={id}
//           />
//         </div>
//       </div>
//       {isDialogActive && (
//         <div
//           className="fixed inset-0  bg-opacity-50 backdrop-blur-sm z-40"
//           onClick={(e) => {
//             toggleDialog(e);
//           }}
//         />
//       )}
//       <Toaster position="bottom-right" />
//     </>
//   );
// }

// export default NoteCard;

import { useEffect, useRef, useState } from "react";

import { useNote } from "../Hooks/useNote";

import { useUpdateData } from "../Services/apiNotes";

import NoteCardContent from "./NoteCardContent";

import useDebounce from "../Hooks/useDebounce";

import useCustomToast from "@/Hooks/useCustomToast";

function NoteCard({ noteData }) {
  const { updateNote } = useNote();

  const { errorToast, Toaster } = useCustomToast();

  const { updateData, error: updateError } = useUpdateData("Note");

  const debounce = useDebounce();

  // Takes a callback
  const debouncedUpdateData = debounce(300, async (id, updates) => {
    try {
      await updateData(id, updates);
    } catch (error) {
      errorToast("Failed To Update");
    }
  });

  // Global States
  const { id, title, _tag, note, images, isPinned } = noteData;

  const [isExpanded] = useState(true);

  const [isDialogActive, setIsDialogActive] = useState(false);

  const editableTitleDiv = useRef(null);

  const editableNoteDiv = useRef(null);

  const editableTaglineDiv = useRef(null);

  // Can also decounce the updateNote
  const handleTitleUpdate = async (e) => {
    const content = e.target.innerText;
    updateNote(id, "title", content);
    debouncedUpdateData(id, { title: content });
  };

  const handleNoteUpdate = async (e) => {
    const content = e.target.innerText;
    updateNote(id, "note", content);
    debouncedUpdateData(id, { note: content });
  };

  const handleTagUpdate = async (e) => {
    const content = e.target.innerText;
    updateNote(id, "_tag", content);
    debouncedUpdateData(id, { _tag: content });
  };

  // Need to manually handle the text node of EditableDiv.
  useEffect(() => {
    const updateContent = () => {
      if (editableTitleDiv.current) {
        editableTitleDiv.current.textContent = title;
      }
      if (editableNoteDiv.current) {
        editableNoteDiv.current.textContent = note;
      }
      if (editableTaglineDiv.current) {
        editableTaglineDiv.current.textContent = _tag;
      }
    };

    updateContent();
  }, [title, note, _tag]);

  // Handle scrollbar and padding (add additional padding when dialog is active)
  useEffect(() => {
    const handleScrollBar = () => {
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      if (isDialogActive) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.paddingRight = "0px";
        document.body.style.overflow = "auto";
      }
    };

    handleScrollBar();

    window.addEventListener("resize", handleScrollBar);

    return () => {
      document.body.style.paddingRight = "0px";
      document.body.style.overflow = "auto";
      window.removeEventListener("resize", handleScrollBar);
    };
  }, [isDialogActive]);

  const dialogClass = `z-50 absolute top-0 left-0 transform sm:scale-110 scale-105`;

  const isDivEditable = isDialogActive ? true : false;

  if (updateError) {
    errorToast("Cloud Upload Failed.");
  }

  return (
    <>
      <div
        className={`relative border border-slate-300/30 rounded-lg p-4 w-[23rem] transition-all duration-200 ease-in sm:w-[34.375rem]  
        ${isDialogActive ? dialogClass : ""}
        }`}
        onClick={() => setIsDialogActive(true)}
      >
        <div className={`mb-4`}>
          {/* Can make the props less by sending the node data directly. But i like it more declarative */}
          <NoteCardContent
            editableTitleDiv={editableTitleDiv}
            isDialogActive={isDialogActive}
            setIsDialogActive={setIsDialogActive}
            editableNoteDiv={editableNoteDiv}
            editableTaglineDiv={editableTaglineDiv}
            isExpanded={isExpanded}
            isEditable={isDivEditable}
            handleTitleUpdate={handleTitleUpdate}
            handleNoteUpdate={handleNoteUpdate}
            handleTagUpdate={handleTagUpdate}
            images={images}
            isPinned={isPinned}
            id={id}
          />
        </div>
      </div>
      {isDialogActive && (
        <div
          className="fixed inset-0 bg-opacity-50 backdrop-blur-sm z-40"
          onClick={(e) => {
            e.stopPropagation();
            setIsDialogActive(false);
          }}
        />
      )}
      <Toaster position="bottom-right" />
    </>
  );
}

export default NoteCard;
