import React from "react";

const FormWrap = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-fit h-full flex items-center justify-center pb-12 pt-24">
      <div className="bg-white max-w-[950px] flex w-full flex-col gap-6 items-center  p-4 md:p-8">
        {children}
      </div>
    </div>
  );
};

export default FormWrap;
