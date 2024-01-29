import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import { Expense } from "@prisma/client";
import getExpenses from "@/actions/getExpenses";
import getExpensesToday from "@/actions/getExpensesToday";
import getExpensesForMonth from "@/actions/getExpensesForMonth";
import getExpensesForYear from "@/actions/getExpensesForYear";
import { getCurrentUser } from "@/actions/getCurrentUser";
import AllExpensesClient from "./components/ExpensesListClient";

export const metadata: Metadata = {
  title: "Goldpay Operations - Approved Expenses",
  description: "This is the all expenses page",
  // other metadata
};

interface IParams {
  periodId?: string;
}

const Page = async ({ params }: { params: IParams }) => {
  const currentUser = await getCurrentUser();
  const { periodId } = params;
  const approved = true;
  let expenses: Expense[] = [];

  switch (periodId) {
    case "today":
      const { expensesToday, totalAmountToday } = await getExpensesToday(
        approved
      );
      expenses = expensesToday;
      break;
    case "this-month":
      const { expensesForMonth, totalAmountForMonth } =
        await getExpensesForMonth(approved);
      expenses = expensesForMonth;
      break;
    case "this-year":
      const { expensesForYear, totalAmountForYear } = await getExpensesForYear(
        approved
      );
      expenses = expensesForYear;
      break;
    default:
      // Handle default case if needed
      break;
  }

  // You might need to fetch currentUser using getCurrentUser
  // const currentUser = await getCurrentUser();

  // if (!currentUser || currentUser.role !== "ADMIN") {
  //   return <NullData title="Oops!, Access denied" />;
  // }

  return (
    <>
      <Breadcrumb pageName={`Expenses - ${periodId?.toUpperCase()}`} />

      <div className="overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
          <AllExpensesClient expenses={expenses} currentUser={currentUser} />
        </div>
      </div>
    </>
  );
};

export default Page;
