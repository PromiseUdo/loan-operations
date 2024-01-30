import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import { Expense, Loan } from "@prisma/client";
import getExpenses from "@/actions/getExpenses";
import getExpensesToday from "@/actions/getExpensesToday";
import getExpensesForMonth from "@/actions/getExpensesForMonth";
import getExpensesForYear from "@/actions/getExpensesForYear";
import { getCurrentUser } from "@/actions/getCurrentUser";
import LoanListClient from "./components/LoanListClient";
import getRevenueForMonth from "@/actions/getRevenueForMonth";
import getRevenueToday from "@/actions/getRevenueToday";
import getRevenueForYear from "@/actions/getRevenueForYear";

export const metadata: Metadata = {
  title: "Loanpay Operations - Approved Expenses",
  description: "This is the all expenses page",
  // other metadata
};

interface IParams {
  loanId?: string;
}

const Page = async ({ params }: { params: IParams }) => {
  const currentUser = await getCurrentUser();
  const { loanId } = params;
  let loans: Loan[] = [];

  switch (loanId) {
    case "today":
      const { loansToday, totalRevenueToday } = await getRevenueToday();

      loans = loansToday;
      break;
    case "this-month":
      const { loansForMonth, totalRevenueForMonth } =
        await getRevenueForMonth();
      loans = loansForMonth;
      break;
    case "this-year":
      const { loansForYear, totalRevenueForYear } = await getRevenueForYear();

      loans = loansForYear;
      break;
    default:
      // Handle default case if needed
      break;
  }

  return (
    <>
      <Breadcrumb
        pageName={`Revenue Accured here - ${loanId?.toUpperCase()}`}
      />

      <div className="overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
          <LoanListClient loans={loans} currentUser={currentUser} />
        </div>
      </div>
    </>
  );
};

export default Page;
