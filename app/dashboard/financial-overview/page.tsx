import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

import { Metadata } from "next";
import getCustomers from "@/actions/getCustomers";
import { getCurrentUser } from "@/actions/getCurrentUser";
import getExpensesToday from "@/actions/getExpensesToday";
import getExpensesForMonth from "@/actions/getExpensesForMonth";
import getExpensesForYear from "@/actions/getExpensesForYear";
import FinancialOverviewClient from "./components/FinancialOverviewClient";
import getExpenses from "@/actions/getExpenses";
import getLoans from "@/actions/getLoans";
import getRevenueToday from "@/actions/getRevenueToday";
import getRevenueForMonth from "@/actions/getRevenueForMonth";
import getRevenueForYear from "@/actions/getRevenueForYear";
export const metadata: Metadata = {
  title: "Loanpay Operations - Financial Overview",
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

  const { loansToday, totalRevenueToday } = await getRevenueToday();
  const { loansForMonth, totalRevenueForMonth } = await getRevenueForMonth();
  const { loansForYear, totalRevenueForYear } = await getRevenueForYear();
  return (
    <>
      <Breadcrumb pageName="Financial Overview" />

      <div className="overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
          <FinancialOverviewClient
            // customers={customers}
            currentUser={currentUser}
            totalAmountToday={totalAmountToday}
            totalAmountForMonth={totalAmountForMonth}
            totalAmountForYear={totalAmountForYear}
            revenueToday={totalRevenueToday}
            revenueMonth={totalRevenueForMonth}
            totalRevenueForYear={totalRevenueForYear}
          />
        </div>
      </div>
    </>
  );
};

export default page;
