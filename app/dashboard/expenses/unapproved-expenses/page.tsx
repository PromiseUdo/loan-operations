import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

import { Metadata } from "next";
import getCustomers from "@/actions/getCustomers";
import { getCurrentUser } from "@/actions/getCurrentUser";
import getExpenses from "@/actions/getExpenses";
import AllExpensesClient from "./components/UnapprovedExpensesClient";
export const metadata: Metadata = {
  title: "Loanpay Operations - Unapproved Expenses",
  description: "This is the unapproved expenses page",
  // other metadata
};

const page = async () => {
  const approved = false;
  const currentUser = await getCurrentUser();
  const expenses = await getExpenses(approved);

  // if (!currentUser || currentUser.role !== "ADMIN") {
  //   return <NullData title="Oops!, Access denied" />;
  // }
  return (
    <>
      <Breadcrumb pageName="Unapproved Expenses" />

      <div className="overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
          <AllExpensesClient expenses={expenses} currentUser={currentUser} />
        </div>
      </div>
    </>
  );
};

export default page;
