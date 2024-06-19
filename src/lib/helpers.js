export const calcImageContainerGrid = (imageLength) => {
  if (typeof imageLength !== "number" || imageLength <= 0) {
    throw new Error(
      "Invalid Type. Function is expecting a positive number of images."
    );
  }

  const baseClass = "grid gap-4 mb-4";
  let gridColumns;

  switch (imageLength) {
    case 1:
      gridColumns = "grid-cols-1";
      break;
    case 2:
      gridColumns = "grid-cols-2";
      break;
    default:
      gridColumns = "grid-cols-2";
      break;
  }

  return `${baseClass} ${gridColumns}`;
};

export const dynamicNoteClasses = (isExpanded) => {
  if (!isExpanded) {
    return `flex items-center justify-center`;
  }

  return `flex flex-col gap-y-2`;
};

export const hiddenNoteClasses = (isExpanded) => {
  if (!isExpanded) {
    return `hidden`;
  }

  return `block`;
};
