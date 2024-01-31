import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

import { Metadata } from "next";
import getCustomers from "@/actions/getCustomers";
import { getCurrentUser } from "@/actions/getCurrentUser";
import ManageExpensesClient from "./components/ManageExpensesClient";
import getExpensesToday from "@/actions/getExpensesToday";
import getExpensesForMonth from "@/actions/getExpensesForMonth";
import getExpensesForYear from "@/actions/getExpensesForYear";
export const metadata: Metadata = {
  title: "Loanpay - Expenses",
  description: "This is Profile page for TailAdmin Next.js",
  // other metadata
};

const page = async () => {
  const websiteReg = false;
  const approved = true;
  const customers = await getCustomers(websiteReg);
  const currentUser = await getCurrentUser();
  const { expensesToday, totalAmountToday } = await getExpensesToday(approved);
  const { expensesForMonth, totalAmountForMonth } = await getExpensesForMonth(
    approved
  );
  const { expensesForYear, totalAmountForYear } = await getExpensesForYear(
    approved
  );

  return (
    <>
      <Breadcrumb pageName="Expenses" />

      <div className="overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
          <ManageExpensesClient
            // customers={customers}
            currentUser={currentUser}
            totalAmountToday={totalAmountToday}
            totalAmountForMonth={totalAmountForMonth}
            totalAmountForYear={totalAmountForYear}
          />
        </div>
      </div>
    </>
  );
};

export default page;
