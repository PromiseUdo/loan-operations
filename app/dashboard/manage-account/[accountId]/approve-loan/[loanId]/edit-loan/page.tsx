import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Image from "next/image";

import { Metadata } from "next";
import getCustomerById from "@/actions/getCustomerById";
import getLoansByCustomerId from "@/actions/getLoansByCustomerId";
import { getCurrentUser } from "@/actions/getCurrentUser";
import EditLoanClient from "./components/EditLoanClient";
import AccountSummary from "./components/AccountSummary";
import getLoanById from "@/actions/getLoanById";
import Link from "next/link";
export const metadata: Metadata = {
  title: "Goldpay Operations - Edit Loan",
  description: "This is Profile page for TailAdmin Next.js",
  // other metadata
};
interface IParams {
  accountId?: string;
  loanId?: string;
}
const page = async ({ params }: { params: IParams }) => {
  const customer = await getCustomerById(params);
  const loan = await getLoanById({ id: params?.loanId });
  const loans = await getLoansByCustomerId(params);
  const currentUser = await getCurrentUser();

  // console.log(loan);
  const loanWithUnpaid = loans?.find((loan) => loan.clearedStatus === false);
  return (
    <>
      <div className="mx-auto max-w-270">
        <Breadcrumb
          pageName={`Edit Loan - ${customer?.firstname} ${customer?.lastname}`}
        />
        <div className="grid grid-cols-5 gap-8">
          {loan?.paidPeriods! === 0 ? (
            <EditLoanClient
              customer={customer ?? null}
              loan={loan ?? null}
              currentUser={currentUser}
            />
          ) : (
            <div className="col-span-5 xl:col-span-3">
              <div className="h-full w-full flex flex-col gap-3 items-center justify-center">
                <p className="text-2xl text-center font-semibold">
                  Sorry, loan cannot be edited as payments have already been
                  recorded.
                </p>
                <Link
                  href={`/dashboard/manage-account/${customer?.id}/approve-loan`}
                  className="bg-primary text-[#f7f7f7] px-4 py-2 rounded-md text-sm hover:underline"
                >
                  Go back
                </Link>
              </div>
            </div>
          )}
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
