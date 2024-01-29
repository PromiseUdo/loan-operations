import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Image from "next/image";

import { Metadata } from "next";
import Heading from "@/app/components/Heading";
import getCustomerById from "@/actions/getCustomerById";
import getLoansByCustomerId from "@/actions/getLoansByCustomerId";
import { getCurrentUser } from "@/actions/getCurrentUser";
import Link from "next/link";
import EditPaymentForm from "./components/EditPaymentForm";
import AccountSummary from "../../../make-payment/components/AccountSummary";
import getPaymentByLoanId from "@/actions/getPaymentByLoanId";
export const metadata: Metadata = {
  title: "Profile Page | Next.js E-commerce Dashboard Template",
  description: "This is Profile page for TailAdmin Next.js",
  // other metadata
};
interface IParams {
  accountId?: string;
  paymentId?: string;
}

const page = async ({ params }: { params: IParams }) => {
  const payment = await getPaymentByLoanId({ paymentId: params.paymentId });
  const currentUser = await getCurrentUser();
  const customer = await getCustomerById(params);
  const loans = await getLoansByCustomerId(params);
  const loanWithUnpaid = loans?.find((loan) => loan.clearedStatus === false);
  return (
    <>
      <div className="mx-auto max-w-270">
        <Breadcrumb
          pageName={`Edit Payment - ${customer?.firstname} ${customer?.lastname}`}
        />

        <div className="grid grid-cols-5 gap-8">
          {loanWithUnpaid ? (
            <EditPaymentForm
              payment={payment!}
              customer={customer ?? null}
              customerId={params.accountId!}
              loan={loanWithUnpaid ?? null}
              currentUser={currentUser}
            />
          ) : (
            <div className="col-span-5 xl:col-span-3">
              <div className="h-full w-full flex flex-col gap-3 items-center justify-center">
                <p className="text-2xl font-semibold">
                  No unpaid loans at the moment.
                </p>
                <Link
                  className="bg-primary text-[#f7f7f7] px-4 py-2 rounded-md text-sm hover:underline"
                  href={`/dashboard/manage-account/${customer?.id}/create-loan`}
                >
                  Click To Create New Loan
                </Link>
              </div>
            </div>
          )}
          <AccountSummary
            customer={customer ?? null}
            loans={loans ?? null}
            unpaidLoan={loanWithUnpaid ?? null}
          />
        </div>
      </div>
    </>
  );
};

export default page;
