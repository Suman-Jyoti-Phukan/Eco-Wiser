/* eslint-disable react/prop-types */

import { forwardRef } from "react";

const EditableDiv = forwardRef(
  (
    {
      dataPlaceholder = "Add Something...",
      className = "",
      role = "textbox",
      isEditable = true,
      ...props
    },
    ref
  ) => {
    const baseClass = `bg-neutral-900 rounded w-full font-bold focus:outline-none editableDivPlaceholder white-space-pre-wrap!important word-break-break-all!important overflow-hidden`;

    return (
      <div
        ref={ref}
        data-placeholder={dataPlaceholder}
        className={`${baseClass} ${className}`}
        contentEditable={isEditable}
        role={role}
        {...props}
      ></div>
    );
  }
);

EditableDiv.displayName = "EditableDiv";

export default EditableDiv;
