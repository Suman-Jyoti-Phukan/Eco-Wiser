import { useState, useRef, useEffect } from "react";

import { Image, Trash } from "lucide-react";

import {
  calcImageContainerGrid,
  dynamicNoteClasses,
  hiddenNoteClasses,
} from "../lib/helpers";

import { useNote } from "../Hooks/useNote.js";

import Button from "./Button";

import EditableDiv from "./EditableDiv";

import { useCreateData, useUploadImage } from "../Services/apiNotes.js";

import Spinner from "./Spinner";

import useCustomToast from "@/Hooks/useCustomToast";

function NoteEditor() {
  const { addNote } = useNote();

  const {
    uploadImage,
    error: imageError,
    isLoading: isImageUploadLoading,
  } = useUploadImage();

  const {
    data: newRecord,
    isLoading,
    createData,
    error: createDataError,
  } = useCreateData("Note");

  const { successToast, errorToast, Toaster } = useCustomToast();

  const [title, setTitle] = useState(null);

  const [note, setNote] = useState(null);

  const [_tag, setTagline] = useState(null);

  const [images, setImages] = useState([]);

  const [isExpanded, setIsExpanded] = useState(false);

  const fileInputRef = useRef(null);

  const editorRef = useRef(null);

  const editableTitleDiv = useRef(null);

  const editableNoteDiv = useRef(null);

  const editableTaglineDiv = useRef(null);

  const handleTitleInput = (e) => {
    setTitle(e.target.innerText);
  };

  const handleNoteInput = (e) => {
    setNote(e.target.innerText);
  };

  const handleTaglineInput = (e) => {
    setTagline(e.target.innerText);
  };

  const handleOnExpand = () => {
    setIsExpanded(true);
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const data = await uploadImage(file);

        if (data) {
          const reader = new FileReader();
          reader.onload = () => {
            setImages([
              ...images,
              { supabaseUrl: data.path, dataUrl: reader.result },
            ]);
          };
          reader.readAsDataURL(file);
          successToast("Uploaded");
        }
      } catch (err) {
        errorToast("Failed To Upload At Cloud");
      }
    }
  };

  const handleRemoveImage = (index, e) => {
    e.stopPropagation();

    const updatedImages = [...images];

    updatedImages.splice(index, 1);

    setImages(updatedImages);
  };

  const handleImageClick = (e) => {
    if (images.length === 2) {
      errorToast("Max two files are allowed.");
      return null;
    }

    e.stopPropagation();
    fileInputRef.current.click();
  };

  const handleClickOutside = (event) => {
    if (editorRef.current && !editorRef.current.contains(event.target)) {
      setIsExpanded(false);
    }
  };

  const handleCreateNewNote = async () => {
    const removeDataUrlFromImage = images.map((item) => {
      return item.supabaseUrl;
    });

    if (!note) {
      errorToast("Add A Note");
      return;
    }

    if (!title) {
      errorToast("Add A Title");
      return;
    }

    try {
      await createData({
        title,
        note,
        _tag,
        images: removeDataUrlFromImage,
      });

      successToast("Created");
    } catch (err) {
      errorToast("Failed To Upload Data");
    }
  };

  const handleOnSave = (e) => {
    e.stopPropagation();

    handleCreateNewNote();

    /* State Reset After updating the state. */
    setTitle(null);
    setNote(null);
    setTagline(null);
    setIsExpanded(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
    if (editorRef.current) {
      editorRef.current.value = null;
    }

    if (editableTitleDiv.current) {
      editableTitleDiv.current.textContent = "";
    }

    if (editableNoteDiv.current) {
      editableNoteDiv.current.textContent = "";
    }

    if (editableTaglineDiv.current) {
      editableTaglineDiv.current.textContent = "";
    }
  };

  useEffect(() => {
    if (isExpanded) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isExpanded]);

  // Updating the new record after saving it on the db.
  useEffect(() => {
    if (newRecord) {
      setImages([]);
      addNote({
        ...newRecord,
        images,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newRecord]);

  if (imageError) {
    errorToast(imageError);
  }

  if (createDataError) {
    errorToast(createDataError);
  }

  return (
    <div
      ref={editorRef}
      className="border border-slate-300/30 rounded-lg p-2 sm:p-4 w-[23rem] sm:w-[34.375rem]  mt-20"
      onClick={handleOnExpand}
    >
      <div className="">
        {images.length > 0 && (
          <div className={calcImageContainerGrid(images.length)}>
            {images.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={image.dataUrl}
                  alt="Uploaded"
                  className="w-full h-[16rem] rounded object-cover"
                  loading="lazy"
                />
                <Button
                  onClick={(e) => {
                    handleRemoveImage(index, e);
                    successToast("Deleted");
                  }}
                  className="absolute top-1 right-1 p-2"
                >
                  <Trash size={16} />
                </Button>
              </div>
            ))}
          </div>
        )}

        <div className={`${dynamicNoteClasses(isExpanded)}`}>
          <EditableDiv
            dataPlaceholder="Title..."
            onInput={handleTitleInput}
            ref={editableTitleDiv}
            className="text-emerald-50 text-base sm:text-lg"
          />

          <EditableDiv
            dataPlaceholder="Add a note..."
            onInput={handleNoteInput}
            className={`${hiddenNoteClasses(
              isExpanded
            )} font-semibold text-emerald-100 text-sm sm:text-base my-2`}
            ref={editableNoteDiv}
          />

          <EditableDiv
            dataPlaceholder="#TAGLINE"
            onInput={handleTaglineInput}
            className={`${hiddenNoteClasses(
              isExpanded
            )} font-semibold text-emerald-400 text-sm sm:text-base`}
            ref={editableTaglineDiv}
          />

          <div className="-ml-2">
            <div className="flex">
              <div>
                <Button
                  onClick={handleImageClick}
                  className="hover:bg-zinc-800 "
                >
                  <Image className="text-slate-100" size={18} />
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>
            </div>
          </div>

          <Button
            onClick={(e) => handleOnSave(e)}
            className="bg-emerald-500 hover:bg-emerald-600 text-base font-bold text-white border border-emerald-900   mx-2 px-6 py-2 flex items-center justify-center "
          >
            {isLoading || isImageUploadLoading ? (
              <Spinner />
            ) : (
              <span>Save</span>
            )}
          </Button>
        </div>
      </div>
      <Toaster position="bottom-right" />
    </div>
  );
}

export default NoteEditor;
