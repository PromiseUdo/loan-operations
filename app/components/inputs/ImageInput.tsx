"use client";

import { ImageType } from "@/types/image";
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

interface SelectImageProps {
  item?: ImageType;
  handleFileChange: (value: File) => void;
}
const ImageInput: React.FC<SelectImageProps> = ({ item, handleFileChange }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Do something with the files

    if (acceptedFiles.length > 0) {
      handleFileChange(acceptedFiles[0]);
    }
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".pdf", ".doc", ".docx"] },
  });
  return (
    <div
      {...getRootProps()}
      className="border-2 border-slate-400 p-2 border-dashed cursor-pointer text-sm font-normal text-slate-400 flex items-center justify-center"
    >
      <input {...getInputProps()} />

      {isDragActive ? <p>Drop the Image here...</p> : <>Select image</>}
    </div>
  );
};

export default ImageInput;
