import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import { Expense } from "@prisma/client";
import getExpenses from "@/actions/getExpenses";
import getExpensesToday from "@/actions/getExpensesToday";
import getExpensesForMonth from "@/actions/getExpensesForMonth";
import getExpensesForYear from "@/actions/getExpensesForYear";
import { getCurrentUser } from "@/actions/getCurrentUser";
import getLoans from "@/actions/getLoans";
import SummaryTableClient from "./components/SummaryTableClient";
import { v4 as uuidv4 } from "uuid";

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
  console.log(periodId, "periodid");
  const approved = true;

  const [loans, expenses] = await Promise.all([
    getLoans(),
    getExpenses(approved),
  ]);

  // Initialize an object to store sums for each month
  const monthSums: { [key: string]: any } = {};

  // Helper function to get the month from a date string
  const getMonthFromDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("default", { month: "long" });
  };

  // Function to update month sums
  const updateMonthSums = (
    month: string,
    year: number,
    category: string,
    amount: number
  ) => {
    const key = `${year}_${month}_${category}`;
    if (!monthSums[key]) {
      monthSums[key] = {
        id: uuidv4(),
        date: {
          month,
          year,
        },
        category,
        amount,
      };
    } else {
      monthSums[key].amount += amount;
    }
  };

  // Calculate sums of fees for all records
  loans.forEach((loan) => {
    const date = new Date(loan.createdAt.toString());
    const month = getMonthFromDate(loan.createdAt.toString());
    const year = date.getFullYear(); // Get the year separately
    updateMonthSums(month, year, "Legal Fee", loan.legalFee);
    updateMonthSums(month, year, "Insurance Fee", loan.insuranceFee);
    updateMonthSums(month, year, "Advisory Fee", loan.advisoryFee);
    updateMonthSums(month, year, "Mgmt Fee", loan.mgmtFee);
    // Add other fee categories similarly
  });

  // Calculate sum of earnedInterestRevenue for all records
  loans
    .filter((loan) => loan.earnedRevenue !== null)
    .forEach((loan) => {
      const date = new Date(loan.createdAt.toString());
      const month = getMonthFromDate(loan.createdAt.toString());
      const year = date.getFullYear(); // Get the year separately
      updateMonthSums(
        month,
        year,
        "Earned Interest Revenue",
        loan.earnedRevenue ?? 0
      );
    });
  loans
    .filter((loan) => loan.lateFees !== null)
    .forEach((loan) => {
      const date = new Date(loan.createdAt.toString());
      const month = getMonthFromDate(loan.createdAt.toString());
      const year = date.getFullYear(); // Get the year separately
      updateMonthSums(month, year, "Late Fees", loan.lateFees ?? 0);
    });

  // Calculate sums of expenses for each category
  // (Similar to the previous code, but update the monthSums)
  expenses.forEach((expense) => {
    const date = new Date(expense.createdAt.toString());
    const month = getMonthFromDate(expense.createdAt.toString());
    const year = date.getFullYear(); // Get the year separately

    switch (expense.category) {
      case "Office Supplies":
        updateMonthSums(month, year, "Office Supplies", expense.amount);
        break;
      case "Salary":
        updateMonthSums(month, year, "Salary", expense.amount);
        break;
      case "Rent":
        updateMonthSums(month, year, "Rent", expense.amount);
        break;
      case "Utilities":
        updateMonthSums(month, year, "Utilities", expense.amount);
        break;
      case "Office Equipment":
        updateMonthSums(month, year, "Office Equipment", expense.amount);
        break;
      case "Marketing and Advertising":
        updateMonthSums(
          month,
          year,
          "Marketing and Advertising",
          expense.amount
        );
        break;
      case "Website Development & Maintenance":
        updateMonthSums(
          month,
          year,
          "Website Development & Maintenance",
          expense.amount
        );
        break;
      case "Internet Data":
        updateMonthSums(month, year, "Internet Data", expense.amount);
        break;
      case "Insurance":
        updateMonthSums(month, year, "Insurance", expense.amount);
        break;
      case "Travel & Accommodation":
        updateMonthSums(month, year, "Travel & Accommodation", expense.amount);
        break;
      case "Miscellaneous":
        updateMonthSums(month, year, "Miscellaneous", expense.amount);
        break;
      case "Other":
        updateMonthSums(month, year, "Other", expense.amount);
        break;
      // Add other expense categories similarly
    }
  });

  // Convert monthSums object values to an array and sort by date
  const sortedCombinedData = Object.values(monthSums).sort((a, b) => {
    // Convert month and year to a comparable format for sorting
    const aDate = new Date(`${a.date.year}-${a.date.month}`);
    const bDate = new Date(`${b.date.year}-${b.date.month}`);
    return aDate.getTime() - bDate.getTime();
  });

  // console.log(sortedCombinedData);

  // console.log(sortedCombinedData, "fdfdfdf");

  return (
    <>
      <Breadcrumb pageName={`Financial Totals: Revenues, Expenses`} />

      <div className="overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
          <SummaryTableClient
            cashFlow={sortedCombinedData}
            currentUser={currentUser}
          />
        </div>
      </div>
    </>
  );
};

export default Page;
