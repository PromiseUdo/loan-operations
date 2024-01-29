import Link from "next/link";
import React, { ReactNode } from "react";

interface CardDataStatsProps {
  title: string;
  total: string;
  periodId?: string;
  caption?: string;
  url?: string;
}

const CardDataStats: React.FC<CardDataStatsProps> = ({
  title,
  total,
  periodId,
  caption,
  url,
}) => {
  return (
    <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="w-full mt-4 flex items-end justify-between">
        <div className=" w-full gap-1 flex items-center justify-center flex-col">
          <h4 className=" text-title-sm font-bold text-black dark:text-white">
            {total}
          </h4>
          <span className="text-sm font-medium">{title}</span>
          {periodId && caption && (
            <Link
              href={url ?? ""}
              className="block text-sm text-primary hover:underline font-medium"
            >
              {caption}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardDataStats;
