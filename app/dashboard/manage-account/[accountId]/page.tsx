import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Image from "next/image";

import { Metadata } from "next";
import Link from "next/link";
import { getCurrentUser } from "@/actions/getCurrentUser";
import getCustomerById from "@/actions/getCustomerById";
import ManageCustomerClient from "./components/ManageCustomerClient";
import getLoansByCustomerId from "@/actions/getLoansByCustomerId";
import { SafeUser } from "@/types/user";
export const metadata: Metadata = {
  title: "Loanpay Operations - Manage Accounts",
  description: "Manage Accounts page",
  // other metadata
};
interface IParams {
  accountId?: string;
}
const CustomerAccount = async ({ params }: { params: IParams }) => {
  // const websiteReg = false;
  const currentUser = await getCurrentUser();
  const customer = await getCustomerById(params);
  const loans = await getLoansByCustomerId(params);
  const loanWithUnpaid = loans?.find((loan) => loan.clearedStatus === false);
  console.log(loanWithUnpaid, "unpaid");
  return (
    <>
      <Breadcrumb pageName="Customer Account" />
      <ManageCustomerClient
        currentUser={currentUser}
        customer={customer ?? null}
        loans={loans ?? null}
        unpaidLoan={loanWithUnpaid ?? null}
      />
    </>
  );
};

export default CustomerAccount;
