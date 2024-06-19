/* eslint-disable react/prop-types */
import { Image, Trash, Pin, PinOff } from "lucide-react";

import { calcImageContainerGrid, dynamicNoteClasses } from "../lib/helpers";

import Button from "./Button";

import EditableDiv from "./EditableDiv";

import { useNote } from "../Hooks/useNote";

import { useEffect, useRef, useState } from "react";

import { supabase } from "../Services/supabase";

import {
  useDeleteData,
  useUpdateData,
  useUploadImage,
} from "../Services/apiNotes";

import useCustomToast from "@/Hooks/useCustomToast";

import AlertConfirm from "./AlertConfirm";

function NoteCardContent({
  editableTitleDiv,
  editableNoteDiv,
  editableTaglineDiv,
  isExpanded,
  isEditable = true,
  handleTitleUpdate,
  handleNoteUpdate,
  handleTagUpdate,
  images,
  isPinned,
  id,
}) {
  const [ImageCloudUrl, setImageCloudUrl] = useState([]);

  const fileInputRef = useRef(null);

  const { successToast, errorToast, Toaster } = useCustomToast();

  const { uploadImage, error: errorImage } = useUploadImage();

  const { removeImage, notes, updateNote, removeNote, isPinnable } = useNote();

  const { updateData, error: errorUpdate } = useUpdateData("Note");

  const { deleteData, isLoading: deleteIsLoading } = useDeleteData("Note");

  const handleImageClick = (e) => {
    e.stopPropagation();
    fileInputRef.current.click();
  };

  const handleImageChange = async (e) => {
    e.stopPropagation();

    const file = e.target.files[0];

    if (file) {
      try {
        // Uploading files in bucket.
        const data = await uploadImage(file);

        if (data) {
          const reader = new FileReader();
          reader.onload = async () => {
            const noteToUpdate = notes.find((note) => note.id === id);

            // Might be confusion to understand.
            if (images.length > 0 && !noteToUpdate.images[0].dataUrl) {
              updateNote(id, "images", [...noteToUpdate.images, data.path]);

              await updateData(id, {
                images: [...noteToUpdate.images, data.path],
              });
            } else {
              updateNote(id, "images", [
                ...noteToUpdate.images,
                { supabaseUrl: data.path, dataUrl: reader.result },
              ]);

              const existingPath = noteToUpdate.images.map(
                (item) => item.supabaseUrl
              );

              await updateData(id, {
                images: [...existingPath, data.path],
              });
            }
          };

          reader.readAsDataURL(file);

          /* Bug -> Two toast are displayed. */
          /* successToast("Uploaded"); */
        }
      } catch (err) {
        errorToast("Failed To Upload At Cloud");
      }
    }
  };

  // Local State Update
  const removeImageCloudUrl = (imageUrl) => {
    setImageCloudUrl((prevUrls) => prevUrls.filter((url) => url !== imageUrl));
  };

  const handleRemoveImages = async (e, index, imageUrl) => {
    e.stopPropagation();

    if (images && images.length > 0) {
      removeImage(id, index);
    }

    if (ImageCloudUrl) {
      removeImageCloudUrl(imageUrl);

      try {
        const noteToUpdate = notes.find((note) => note.id === id);

        const updatedImageUrls = noteToUpdate.images.reduce(
          (acc, imageUrl, i) => (i !== index ? [...acc, imageUrl] : acc),
          []
        );

        await updateData(id, {
          images: updatedImageUrls,
        });
      } catch (err) {
        errorToast(err);
      }
    }
  };

  const togglePinnedState = async (pinState) => {
    updateNote(id, "isPinned", pinState);
    await updateData(id, {
      isPinned: pinState,
    });
  };

  useEffect(() => {
    // Can be made into seperate function. I was running out time. So , I decided to do it here.
    const fetchImages = async (imagePath) => {
      const { data: imageData, error: imageError } = await supabase.storage
        .from("images")
        .getPublicUrl(imagePath);

      if (imageError) {
        throw Error("Error Fetching Images...");
      }

      setImageCloudUrl((prev) => {
        // Only add new URLs that are not already in the state
        if (!prev.includes(imageData.publicUrl)) {
          return [...prev, imageData.publicUrl];
        }
        return prev;
      });
    };

    if (images) {
      images.forEach((item) => {
        if (!item.dataUrl) {
          fetchImages(item);
        }
      });
    }
  }, [images]);

  if (errorImage) {
    errorToast(errorImage);
  }

  if (errorUpdate) {
    errorToast(errorUpdate);
  }

  return (
    <>
      <Toaster position="bottom-right" />
      <div className="">
        {images && images.length > 0 && (
          <div className={calcImageContainerGrid(images.length)}>
            {images.map((image, index) => {
              if (!image.dataUrl) {
                return null;
              }

              return (
                <div key={index} className="relative">
                  <img
                    src={image.dataUrl}
                    alt="Uploaded"
                    className="w-full h-[10rem] sm:h-[16rem] rounded object-cover"
                    loading="lazy"
                  />
                  <Button
                    className="absolute top-1 right-1 p-2  hover:bg-zinc-800 "
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveImages(e, index, image);
                      successToast("Deleted");
                    }}
                  >
                    <Trash size={16} />
                  </Button>
                </div>
              );
            })}
          </div>
        )}

        {ImageCloudUrl && ImageCloudUrl.length > 0 && (
          <div className={calcImageContainerGrid(ImageCloudUrl.length)}>
            {ImageCloudUrl.map((imageUrl, index) => {
              return (
                <div key={index} className="relative">
                  <img
                    src={imageUrl}
                    alt="Uploaded"
                    className="w-full h-[16rem] rounded object-cover"
                    loading="lazy"
                  />

                  <Button
                    className="absolute top-1 right-1 p-2  hover:bg-zinc-800 "
                    onClick={async (e) => {
                      handleRemoveImages(e, index, imageUrl);
                    }}
                  >
                    <Trash size={16} />
                  </Button>
                </div>
              );
            })}
          </div>
        )}

        <div className={`${dynamicNoteClasses(isExpanded)}`}>
          <EditableDiv
            dataPlaceholder="Title..."
            ref={editableTitleDiv}
            isEditable={isEditable}
            onInput={(e) => handleTitleUpdate(e)}
            className="text-emerald-50"
          />

          <EditableDiv
            dataPlaceholder="Add a note..."
            ref={editableNoteDiv}
            isEditable={isEditable}
            onInput={handleNoteUpdate}
            className="font-semibold text-emerald-400 text-sm"
          />

          <EditableDiv
            dataPlaceholder="#TAGLINE"
            ref={editableTaglineDiv}
            isEditable={isEditable}
            onInput={(e) => handleTagUpdate(e)}
            className="font-semibold text-emerald-100 text-sm"
          />

          <div className="-ml-2 flex items-center justify-between">
            <div className="flex space-x-2">
              <div>
                <div>
                  <Button
                    onClick={handleImageClick}
                    className=" hover:bg-zinc-800 "
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
              <div>
                <AlertConfirm
                  removeNote={removeNote}
                  deleteData={deleteData}
                  id={id}
                  isLoadingoading={deleteIsLoading}
                />
              </div>
              <div>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePinnedState(true);
                  }}
                  className="hover:bg-zinc-800 "
                >
                  {isPinnable && !isPinned && (
                    <Pin className="text-slate-100" size={18} />
                  )}
                </Button>
              </div>
            </div>
            <div>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  togglePinnedState(false);
                }}
                className="hover:bg-zinc-800 "
              >
                {isPinned && <PinOff className="text-slate-100" size={18} />}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default NoteCardContent;
