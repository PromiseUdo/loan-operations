import Header from "@/components/Header";
import React, { useEffect, useState } from "react";
import "../data-tables-css.css";
import "../satoshi.css";
import "../globals.css";
import Sidebar from "@/components/Sidebar";
import Loader from "@/components/common/Loader";

export const metadata = {
  title: "Loanpay Operations",
  description: "Loanpay Ops Dashboard",
};
const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="dark:bg-boxdark-2 dark:text-bodydark">
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          <Header />
          <main>
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
