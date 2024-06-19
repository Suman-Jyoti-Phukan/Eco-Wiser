import { useCallback, useRef } from "react";

const useDebounce = () => {
  const debounceTimeout = useRef(null);

  // useCallback to ensure it is not recreated on every render.
  // Delay and the callback function itself.
  const debounce = useCallback((delay, fn) => {
    // Accepts any number of args.. and return another function which call the timer and the cb
    return (...args) => {
      clearTimeout(debounceTimeout.current);
      debounceTimeout.current = setTimeout(() => {
        fn(...args);
      }, delay);
    };
  }, []);

  return debounce;
};

export default useDebounce;
