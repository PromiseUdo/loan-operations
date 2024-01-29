import clsx from "clsx";
import React from "react";
import { IconType } from "react-icons";

interface ButtonProps {
  label: string;
  disabled?: boolean;
  outline?: boolean;
  small?: boolean;
  custom?: string;
  icon?: any;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const Button: React.FC<ButtonProps> = ({
  label,
  disabled,
  outline,
  small,
  custom,
  icon: Icon,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        disabled && "opacity-70 cursor-not-allowed",
        "rounded-lg hover:opacity-80 transition-all w-full  flex items-center justify-center gap-2",
        outline
          ? "bg-[#f7f7f7] text-slate-700 border-shopday-border "
          : "bg-[#f06105] text-[#f7f7f7]",
        small
          ? "text-sm  py-1 px-2 font-light border-[1px]"
          : "text-md py-3 px-4 font-medium border-[2px]",
        custom ? custom : ""
      )}
    >
      {Icon && <Icon size={24} />}
      {label}
    </button>
  );
};

export default Button;
