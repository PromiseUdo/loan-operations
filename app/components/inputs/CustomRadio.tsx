"use client";
import { useState } from "react";

interface IParams {
  name: string;
  label: string;
}

const CustomRadio: React.FC<IParams> = ({ name, label }) => {
  //   const [isChecked, setIsChecked] = useState<boolean>(false);

  return (
    <div>
      <label
        htmlFor="checkboxLabelFour"
        className="flex cursor-pointer select-none items-center"
      >
        <div className="relative">
          <input type="radio" id="checkboxLabelFour" className="sr-only" />
          <div
            className={`mr-4 flex h-5 w-5 items-center justify-center rounded-full border`}
          >
            <span className={`h-2.5 w-2.5 rounded-full bg-transparent `}>
              {" "}
            </span>
          </div>
        </div>
        {label}
      </label>
    </div>
  );
};

export default CustomRadio;
