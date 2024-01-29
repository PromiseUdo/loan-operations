import clsx from "clsx";
import React from "react";

interface HeadingProps {
  title: string;
  center?: boolean;
}

const Heading: React.FC<HeadingProps> = ({ title, center }) => {
  return (
    <div className={clsx(center ? "text-center" : "text-start")}>
      <h1 className="font-medium text-xl">{title}</h1>
    </div>
  );
};

export default Heading;
