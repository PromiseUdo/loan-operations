import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import { Expense } from "@prisma/client";
import getExpenses from "@/actions/getExpenses";
import getExpensesToday from "@/actions/getExpensesToday";
import getExpensesForMonth from "@/actions/getExpensesForMonth";
import getExpensesForYear from "@/actions/getExpensesForYear";
import { getCurrentUser } from "@/actions/getCurrentUser";
import CashFlowClient from "./components/CashFlowClient";
import getLoans from "@/actions/getLoans";
import { v4 as uuidv4 } from "uuid";

export const metadata: Metadata = {
  title: "Loanpay Operations - Approved Expenses",
  description: "This is the all expenses page",
  // other metadata
};

interface IParams {
  periodId?: string;
}

const Page = async ({ params }: { params: IParams }) => {
  const currentUser = await getCurrentUser();
  const { periodId } = params;
  // console.log(periodId, "periodid");
  const approved = true;

  const [loans, expenses] = await Promise.all([
    getLoans(),
    getExpenses(approved),
  ]);

  const cashFlow = [
    ...loans.map((loan) => ({
      id: `${uuidv4()}-LegalFee`, // Unique ID combination
      date: loan.createdAt,
      category: "Legal Fee",
      amount: loan.legalFee,
    })),
    ...loans.map((loan) => ({
      id: `${uuidv4()}-InsuranceFee`, // Unique ID combination
      date: loan.createdAt,
      category: "Insurance Fee",
      amount: loan.insuranceFee,
    })),
    ...loans.map((loan) => ({
      id: `${uuidv4()}-AdvisoryFee`, // Unique ID combination
      date: loan.createdAt,
      category: "Advisory Fee",
      amount: loan.advisoryFee,
    })),
    ...loans.map((loan) => ({
      id: `${uuidv4()}-ManagementFee`, // Unique ID combination
      date: loan.createdAt,
      category: "Management Fee",
      amount: loan.mgmtFee,
    })),
    ...loans
      .filter((loan) => loan.earnedRevenue !== null)
      .map((loan) => ({
        id: `${uuidv4()}-EarnedInterestRevenue`, // Unique ID combination
        date: loan.createdAt,
        category: "earnedInterestRevenue",
        amount: loan.earnedRevenue,
      })),
    ...expenses.map((expense) => ({
      id: `${uuidv4()}-${expense.category}`, // Unique ID combination
      date: expense.createdAt,
      category: expense.category,
      amount: -expense.amount,
    })),
  ];

  // Sort combinedData by date
  cashFlow.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Now, combinedData is ready for use in the table
  console.log(cashFlow, "cashflow");

  return (
    <>
      <Breadcrumb pageName={`Expenses - ${periodId?.toUpperCase()}`} />

      <div className="overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
          <CashFlowClient cashFlow={cashFlow} currentUser={currentUser} />
        </div>
      </div>
    </>
  );
};

export default Page;
