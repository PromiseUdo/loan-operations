import clsx from "clsx";
import React from "react";
import { IconType } from "react-icons";

interface ActionBtnProps {
  icon: IconType;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  filled?: boolean;
}
const ActionBtn: React.FC<ActionBtnProps> = ({
  icon: Icon,
  onClick,
  disabled,
  filled,
}) => {
  const iconStyle = {
    fill: "text-red-500", // Set the fill color using the style prop
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        "flex items-center justify-center rounded cursor-pointer w-[40px] h-[30px] text-slate-700 border border-slate-400 ",
        disabled && "opacity-60 cursor-not-allowed"
      )}
    >
      <Icon size={18} fill={filled ? "#ff0000" : ""} />
    </button>
  );
};

export default ActionBtn;
