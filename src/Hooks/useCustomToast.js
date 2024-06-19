import toast, { Toaster } from "react-hot-toast";

const useCustomToast = () => {
  const notify = (message) => toast(message);

  const successToast = (message) =>
    toast.success(message, {
      style: {
        background: "#1a202c",
        color: "#f7fafc",
        border: "1px solid #2d3748",
      },
    });

  const errorToast = (message) =>
    toast.error(message, {
      style: {
        background: "#f56565",
        color: "#fff",
        border: "1px solid #c53030",
      },
    });

  return {
    notify,
    successToast,
    errorToast,
    Toaster,
  };
};

export default useCustomToast;
