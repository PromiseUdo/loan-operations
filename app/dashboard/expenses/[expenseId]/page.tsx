import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Image from "next/image";

import { Metadata } from "next";
import Link from "next/link";
import { getCurrentUser } from "@/actions/getCurrentUser";
import getCustomerById from "@/actions/getCustomerById";
import getLoansByCustomerId from "@/actions/getLoansByCustomerId";
import { SafeUser } from "@/types/user";
import ViewExpenseClient from "./components/ViewExpenseClient";
import getExpenseById from "@/actions/getExpenseById";
export const metadata: Metadata = {
  title: "Loanpay Operations - Manage Accounts",
  description: "Manage Accounts page",
  // other metadata
};
interface IParams {
  expenseId?: string;
}
const CustomerAccount = async ({ params }: { params: IParams }) => {
  // const websiteReg = false;
  const currentUser = await getCurrentUser();
  const expense = await getExpenseById(params);
  return (
    <>
      <Breadcrumb pageName="Customer Account" />
      <ViewExpenseClient expense={expense ?? null} currentUser={currentUser} />
    </>
  );
};

export default CustomerAccount;
