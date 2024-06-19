/* eslint-disable react/prop-types */
function Button({ children, className, ...props }) {
  const baseClass =
    "p-3 rounded-full transition-all ease-in delay-100 text-slate-100";

  return (
    <button {...props} className={`${baseClass} ${className}`}>
      {children}
    </button>
  );
}

export default Button;
