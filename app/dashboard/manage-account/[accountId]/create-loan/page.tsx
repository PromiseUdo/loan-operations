import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Image from "next/image";

import { Metadata } from "next";
import Heading from "@/app/components/Heading";
import NewLoanForm from "./components/NewLoanForm";
import AccountSummary from "./components/AccountSummary";
import getCustomerById from "@/actions/getCustomerById";
import getLoansByCustomerId from "@/actions/getLoansByCustomerId";
import { getCurrentUser } from "@/actions/getCurrentUser";
export const metadata: Metadata = {
  title: "Profile Page | Next.js E-commerce Dashboard Template",
  description: "This is Profile page for TailAdmin Next.js",
  // other metadata
};
interface IParams {
  accountId?: string;
}
const page = async ({ params }: { params: IParams }) => {
  const customer = await getCustomerById(params);
  const loans = await getLoansByCustomerId(params);
  const loanWithUnpaid = loans?.find((loan) => loan.clearedStatus === false);

  const currentUser = await getCurrentUser();
  return (
    <>
      <div className="mx-auto max-w-270">
        <Breadcrumb
          pageName={`Create Loan - ${customer?.firstname} ${customer?.lastname}`}
        />

        <div className="grid grid-cols-5 gap-8">
          <NewLoanForm
            customer={customer ?? null}
            loans={loans ?? null}
            currentUser={currentUser}
          />
          <AccountSummary
            unpaidLoan={loanWithUnpaid ?? null}
            customer={customer ?? null}
            loans={loans ?? null}
          />
        </div>
      </div>
    </>
  );
};

export default page;
