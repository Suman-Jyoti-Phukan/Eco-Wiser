/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import Button from "./Button";

/* Will handle any client side JS error */
const ErrorBoundary = ({ children }) => {
  const [hasError, setHasError] = useState(false);

  const [errorDetails, setErrorDetails] = useState(null);

  useEffect(() => {
    const errorHandler = (error, errorInfo) => {
      setHasError(true);
      setErrorDetails({ error, errorInfo });
    };

    window.addEventListener("error", errorHandler);
    window.addEventListener("unhandledrejection", errorHandler);

    return () => {
      window.removeEventListener("error", errorHandler);
      window.removeEventListener("unhandledrejection", errorHandler);
    };
  }, []);

  if (hasError) {
    if (import.meta.env.DEV) {
      console.error("Error:", errorDetails.error);
      console.error("Error Info:", errorDetails.errorInfo);
    }

    return (
      <div className="flex flex-col items-center bg-black justify-center h-screen text-slate-100">
        <h1 className="text-3xl font-bold mb-4">
          An unexpected error occurred
        </h1>
        <p className="text-lg mb-8">
          We are sorry, but something went wrong. I will fix it as soon as
          possible.
        </p>
        <Button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-6 rounded"
          onClick={() => window.location.reload()}
        >
          Reload
        </Button>
      </div>
    );
  }

  return children;
};

export default ErrorBoundary;
