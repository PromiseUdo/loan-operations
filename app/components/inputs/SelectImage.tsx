import React, { useState, useEffect, useCallback } from "react";
import Button from "../Button";
import ImageInput from "./ImageInput";
import { ImageType } from "@/types/image";
import { LuAsterisk } from "react-icons/lu";

interface SelectImageProps {
  item: ImageType;
  addImageToState: (value: ImageType) => void;
  removeImageFromState: (value: ImageType) => void;
  isUserCreated: boolean;
  label: string;
}
const SelectImage: React.FC<SelectImageProps> = ({
  item,
  addImageToState,
  removeImageFromState,
  isUserCreated,
  label,
}) => {
  const [isSelected, setIsSelected] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (isUserCreated) {
      setIsSelected(false);
      setFile(null);
    }
  }, [isUserCreated]);

  const handleFileChange = useCallback((value: File) => {
    setFile(value);
    addImageToState(value);
  }, []);

  const handleCheck = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setIsSelected(e.target.checked);

    if (!e.target.checked) {
      setFile(null);
      removeImageFromState(item);
    }
  }, []);

  return (
    <div className="grid grid-cols-1 overflow-y-autoborder-b-[1.2px] border-slate-200 items-center p-2">
      <div className="flex flex-row gap-2 items-center h-[60px]">
        <label
          htmlFor={label}
          className="flex items-center mb-1  text-black dark:text-white"
        >
          <span className=""> {label}</span>
        </label>
      </div>

      <>
        {!file && (
          <div className="col-span-2 text-center">
            <ImageInput item={item} handleFileChange={handleFileChange} />
          </div>
        )}

        {file && (
          <div className="flex flex-row gap-2 text-sm col-span-2 items-center justify-between">
            <p>{file?.name}</p>
            <div className="w-[70px]">
              <Button
                small
                outline
                label="Cancel"
                onClick={() => {
                  setFile(null);
                  removeImageFromState(item);
                }}
              />
            </div>
          </div>
        )}
      </>
    </div>
  );
};

export default SelectImage;
