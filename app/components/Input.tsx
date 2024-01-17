import { ComponentPropsWithoutRef, forwardRef, useId } from "react";

type InputType = ComponentPropsWithoutRef<"input"> & {
  label?: string;
  error?: string;
  wrapperClassName?: string;
};

const Input = forwardRef<HTMLInputElement, InputType>(function Input(
  { label, error, wrapperClassName = "", className = "", ...props },
  ref,
) {
  const inputId = useId();
  const variants = {
    normal:
      "border-light-border focus:border-black dark:border-dark-border dark:focus:border-white",
    error: "border-danger",
  };
  return (
    <div className={`flex flex-col gap-y-2 ${wrapperClassName}`}>
      {label && (
        <label className="text-sm font-bold md:text-base" htmlFor={inputId}>
          {label}
        </label>
      )}
      <input
        {...props}
        id={inputId}
        ref={ref}
        className={`${
          error ? variants.error : variants.normal
        } rounded-[4px] border-[2px] bg-transparent px-4 py-2 font-medium leading-relaxed placeholder:text-black/25 focus:outline-none focus:ring-0  dark:placeholder:text-white/25 ${className}`}
      />
      {error && (
        <span className="text-xs font-bold text-danger md:text-sm">
          {error}
        </span>
      )}
    </div>
  );
});

export default Input;
