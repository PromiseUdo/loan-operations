import { Metadata } from "next";
import getCustomerById from "@/actions/getCustomerById";
import getLoansByCustomerId from "@/actions/getLoansByCustomerId";
import { getCurrentUser } from "@/actions/getCurrentUser";
import ExpenseSummary from "./components/ExpenseSummary";
import NewExpenseForm from "./components/NewExpenseForm";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
export const metadata: Metadata = {
  title: "Loanpay Operations - New Expense",
  description: "Create New Expense page",
  // other metadata
};

const page = async () => {
  // const customer = await getCustomerById(params);

  const currentUser = await getCurrentUser();

  return (
    <>
      <div className="mx-auto max-w-270">
        <Breadcrumb pageName={`New Expense`} />

        <div className="grid grid-cols-5 gap-8">
          <NewExpenseForm currentUser={currentUser} />
          <ExpenseSummary unpaidLoan={null} customer={null} loans={null} />
        </div>
      </div>
    </>
  );
};

export default page;
