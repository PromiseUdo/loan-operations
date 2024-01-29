import { formatPrice } from "@/utils/formatPrice";
import { Customer, Loan } from "@prisma/client";
import Image from "next/image";
import React from "react";
import moment from "moment";
import { addMonthsToDate } from "@/utils/addMonthsToDate";
import Link from "next/link";

interface CustomerSummaryProps {
  customer: Customer | null;
  loans: Loan[] | null;
  unpaidLoan: Loan | null;
  totalAmountForMonth: number | null;
}
const ExpenseSummary: React.FC<CustomerSummaryProps> = ({
  customer,
  totalAmountForMonth,
  loans,
  unpaidLoan,
}) => {
  const declinedLoansCount = loans?.filter(
    (loan: any) => loan.approvalStatus === "DENIED"
  ).length;
  const approvedLoansCount = loans?.filter(
    (loan: any) => loan.approvalStatus === true
  ).length;
  const clearedLoansCount = loans?.filter(
    (loan: any) => loan.clearedStatus === true
  ).length;
  const pendingLoansCount = loans?.filter(
    (loan: any) => loan.approvalStatus === false
  ).length;
  const periodId = "this-month";
  return (
    <div className="col-span-5 xl:col-span-2">
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex items-center w-full justify-between border-b border-stroke py-4 px-7 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            Expenses This Month
          </h3>
          <Link
            className="text-primary hover:underline"
            href={`/dashboard/expenses/all/${periodId}`}
          >
            See Full List
          </Link>
        </div>
        <div className="p-7">
          {/* <form action="#"> */}

          <div
            id="FileUpload"
            className="relative mb-5.5 block w-full cursor-pointer appearance-none rounded border-2  border-primary bg-gray py-4 px-4 dark:bg-meta-4 sm:py-7.5"
          >
            <div className="flex justify-between w-full">
              <div>
                <h3 className="">Total Expenses</h3>
                <p className="text-xl text-red-600">
                  {formatPrice(totalAmountForMonth || 0)}
                </p>
              </div>
            </div>
            <div className="flex justify-between w-full mt-6">
              <div>
                <h3 className="text-sm">Expense</h3>
                <p className="text-sm text-center">{loans?.length}</p>
              </div>
              <div>
                <h3 className="text-sm">Amount</h3>
                <p className="text-sm text-green-600 text-center">
                  {approvedLoansCount}
                </p>
              </div>

              <div>
                <h3 className="text-sm">Date</h3>
                <p className="text-sm text-green-600 text-center">
                  {clearedLoansCount}
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
            {/* <div className="flex justify-between w-full mt-6">
              <div>
                <h3 className="text-sm">Loan B Balance</h3>
                <p className="text-sm">NGN 230,000</p>
              </div>
              <div>
                <h3 className="text-sm">Period Start</h3>
                <p className="text-sm text-green-600">12th Jan 2024</p>
              </div>
              <div>
                <h3 className="text-sm">Period End</h3>
                <p className="text-sm text-red-600">12th Jan 2025</p>
              </div>
            </div> */}
          </div>

          {/* <div className="flex justify-end gap-4.5">
            <button
              className="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
              type="submit"
            >
              Cancel
            </button>
            <button
              className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-95"
              type="submit"
            >
              Save
            </button>
          </div> */}
          {/* </form> */}
        </div>
      </div>
    </div>
  );
};

export default ExpenseSummary;
