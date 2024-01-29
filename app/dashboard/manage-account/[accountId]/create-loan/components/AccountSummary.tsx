import { formatPrice } from "@/utils/formatPrice";
import { Customer, Loan } from "@prisma/client";
import React from "react";
import moment from "moment";
import { addMonthsToDate } from "@/utils/addMonthsToDate";
import Link from "next/link";

interface CustomerSummaryProps {
  customer: Customer | null;
  loans: Loan[] | null;
  unpaidLoan: Loan | null;
}
const AccountSummary: React.FC<CustomerSummaryProps> = ({
  customer,
  loans,
  unpaidLoan,
}) => {
  const approvedLoansCount = loans?.filter(
    (loan: any) => loan.approvalStatus === true
  ).length;
  const clearedLoansCount = loans?.filter(
    (loan: any) => loan.clearedStatus === true
  ).length;
  const pendingLoansCount = loans?.filter(
    (loan: any) => loan.approvalStatus === false
  ).length;

  return (
    <div className="col-span-5 xl:col-span-2">
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex items-center w-full justify-between border-b border-stroke py-4 px-7 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            Account Summary
          </h3>
          <Link
            className="text-primary hover:underline"
            href={`/dashboard/manage-account/${customer?.id}`}
          >
            Go to Profile
          </Link>
        </div>
        <div className="p-7">
          {/* <form action="#"> */}
          <div className="mb-4 flex items-center gap-3">
            <div
              style={{
                background: `url(${
                  customer?.customerPassport || "/defaultImage.png"
                })`,
                backgroundPosition: "center",
                backgroundSize: "contain",
              }}
              className="h-14 w-14 rounded-full"
            ></div>
            <div>
              <span className="mb-1.5 text-black dark:text-white">
                {`${customer?.firstname} ${customer?.lastname}`}
              </span>
            </div>
          </div>

          <div
            id="FileUpload"
            className="relative mb-5.5 block w-full cursor-pointer appearance-none rounded border-2  border-primary bg-gray py-4 px-4 dark:bg-meta-4 sm:py-7.5"
          >
            <div className="flex justify-between w-full">
              <div>
                <h3 className="">Total Balance</h3>
                <p className="text-xl text-red-600">
                  {unpaidLoan?.unpaid
                    ? formatPrice(unpaidLoan?.unpaid - (unpaidLoan?.paid || 0))
                    : formatPrice(0)}
                </p>
              </div>
              {/* <div>
                <h3 className="text-sm">Credit Limit</h3>
                <p className="text-sm text-green-600">NGN 300,000</p>
              </div> */}
            </div>
            <div className="flex justify-between w-full mt-6">
              <div>
                <h3 className="text-sm">Applications</h3>
                <p className="text-sm text-center">{loans?.length}</p>
              </div>
              <div>
                <h3 className="text-sm">Approved</h3>
                <p className="text-sm text-green-600 text-center">
                  {approvedLoansCount}
                </p>
              </div>

              <div>
                <h3 className="text-sm">Cleared</h3>
                <p className="text-sm text-green-600 text-center">
                  {clearedLoansCount}
                </p>
              </div>
              <div>
                <h3 className="text-sm">Pending</h3>
                <p className="text-sm text-green-600 text-center">
                  {pendingLoansCount}
                </p>
              </div>
            </div>
            <div className="flex justify-between w-full mt-6">
              <div>
                <h3 className="text-sm">Unpaid Bal</h3>
                <p className="text-sm">
                  {unpaidLoan?.unpaid
                    ? formatPrice(unpaidLoan?.unpaid - (unpaidLoan?.paid || 0))
                    : formatPrice(0)}
                </p>
              </div>
              <div>
                <h3 className="text-sm">Period Start</h3>
                <p className="text-sm text-green-600">
                  {unpaidLoan &&
                    moment(unpaidLoan?.createdAt).format("MMMM D, YYYY")}
                </p>
              </div>
              <div>
                <h3 className="text-sm">Period End</h3>
                <p className="text-sm text-red-600">
                  {unpaidLoan &&
                    addMonthsToDate(
                      unpaidLoan?.createdAt,
                      unpaidLoan?.numberOfPeriods
                    )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSummary;
