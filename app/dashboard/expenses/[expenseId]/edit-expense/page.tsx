import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Image from "next/image";

import { Metadata } from "next";
import Heading from "@/app/components/Heading";
import getCustomerById from "@/actions/getCustomerById";
import getLoansByCustomerId from "@/actions/getLoansByCustomerId";
import { getCurrentUser } from "@/actions/getCurrentUser";
import Link from "next/link";
import getPaymentByLoanId from "@/actions/getPaymentByLoanId";
import EditPaymentForm from "@/app/dashboard/manage-account/[accountId]/payment-history/[paymentId]/edit-payment/components/EditPaymentForm";
import ExpenseSummary from "./components/ExpenseSummary";
import getExpenseById from "@/actions/getExpenseById";
import EditExpenseForm from "./components/EditExpenseClient";
import getExpensesForMonth from "@/actions/getExpensesForMonth";
export const metadata: Metadata = {
  title: "Loanpay Operations - Edit Payment",
  description: "This is Profile page for TailAdmin Next.js",
  // other metadata
};
interface IParams {
  expenseId?: string;
}

const page = async ({ params }: { params: IParams }) => {
  const currentUser = await getCurrentUser();
  const expense = await getExpenseById(params);
  const approved = true;
  const { expensesForMonth, totalAmountForMonth } = await getExpensesForMonth(
    approved
  );

  return (
    <>
      <div className="mx-auto max-w-270">
        <Breadcrumb pageName={`Edit Expense - ${expense?.desc}`} />

        <div className="grid grid-cols-5 gap-8">
          <EditExpenseForm
            expense={expense ?? null}
            currentUser={currentUser}
          />

          <ExpenseSummary
            totalAmountForMonth={totalAmountForMonth}
            customer={null}
            loans={null}
            unpaidLoan={null}
          />
        </div>
      </div>
    </>
  );
};

export default page;
