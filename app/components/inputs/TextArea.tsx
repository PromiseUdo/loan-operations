"use client";

import clsx from "clsx";
import React from "react";
import {
  FieldErrors,
  FieldValue,
  FieldValues,
  UseFormRegister,
} from "react-hook-form";

interface TextAreaProps {
  id: string;
  label: string;

  disabled?: boolean;
  required?: boolean;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
}

const TextArea: React.FC<TextAreaProps> = ({
  id,
  label,
  disabled,
  required,
  register,
  errors,
}) => {
  return (
    <div className="w-full relative ">
      <textarea
        className={clsx(
          "peer w-full max-h-[150px] min-h-[150px] p-4 pt-6 outline-none bg-white font-light border-2 rounded-md transition disabled:opacity-70 disabled:cursor-not-allowed",
          errors[id]
            ? "border-rose-400 focus:border-rose-400"
            : "border-slate-300 focus:border-slate-300"
        )}
        id={id}
        disabled={disabled}
        {...register(id, { required })}
        placeholder=""
      />
      <label
        className={clsx(
          "absolute cursor-text text-md duration-150 transform -translate-y-3 top-5 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 ",
          errors[id] ? "text-rose-500 " : "text-slate-400 "
        )}
        htmlFor={id}
      >
        {label}
      </label>
    </div>
  );
};

export default TextArea;
