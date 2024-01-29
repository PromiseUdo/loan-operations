"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { SafeCustomer } from "@/types";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/utils/formatPrice";
import { Customer, Loan } from "@prisma/client";
import { IoMdCloseCircle } from "react-icons/io";
import { FaDownload } from "react-icons/fa6";
import toast from "react-hot-toast";
import axios from "axios";
import { AiFillEdit } from "react-icons/ai";
import { SafeUser } from "@/types/user";
import CardDataStats from "../../manage-account/[accountId]/components/CardDataStats";

interface ManageCustomerClientProps {
  currentUser: SafeUser | null;
  totalAmountToday: number | null;
  totalAmountForMonth: number | null;
  totalAmountForYear: number | null;
  revenueToday: number | null;
  revenueMonth: number | null;
  totalRevenueForYear: number | null;
}

const FinancialOverviewClient: React.FC<ManageCustomerClientProps> = ({
  currentUser,
  totalAmountToday,
  totalAmountForMonth,
  totalAmountForYear,
  revenueToday,
  revenueMonth,
  totalRevenueForYear,
}) => {
  // console.log(customer, "customer");
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const router = useRouter();
  // console.log(loans, "<<<<<<<<<<<<<<loans");

  useEffect(() => {
    if (!currentUser) {
      router.push("/");
      router.refresh();
    }
  }, []);

  return (
    // <div className="overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
    <div className="mt-4 px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
      <div className="mt-4">
        <div className="my-4 mx-auto w-full">
          <h4 className="font-semibold text-black dark:text-white">
            Quick Actions
          </h4>
          <div className="mx-auto  mt-4.5 flex items-center justify-center flex-wrap gap-5 xl:gap-7.5">
            {/* <button
              // disabled={customer?.websiteReg === true}
              onClick={() =>
                router.push("/dashboard/financial-overview/cash-flow")
              }
              className="inline-flex items-center justify-center rounded-md bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
            >
              Cash Flow Statement
            </button> */}
            <button
              onClick={() =>
                router.push("/dashboard/financial-overview/summary-table")
              }
              className="inline-flex items-center justify-center rounded-md bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
            >
              View Financial Summary
            </button>
          </div>
        </div>
        <div className="w-full">
          <h4 className="my-4 font-semibold text-black dark:text-white">
            Profit Summary
          </h4>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6 xl:grid-cols-3 2xl:gap-7.5">
            <CardDataStats
              title="For Today"
              periodId="today"
              caption=""
              total={`${formatPrice(
                (revenueToday ?? 0) - (totalAmountToday ?? 0)
              )}`}
            ></CardDataStats>
            <CardDataStats
              periodId="this-month"
              caption=""
              title="For This Month"
              total={`${formatPrice(
                (revenueMonth ?? 0) - (totalAmountForMonth ?? 0)
              )}`}
            ></CardDataStats>
            <CardDataStats
              periodId="this-year"
              caption=""
              title="For This Year"
              total={`${formatPrice(
                (totalRevenueForYear ?? 0) - (totalAmountForYear ?? 0)
              )}`}
            ></CardDataStats>
          </div>
        </div>
        <div className="w-full">
          <h4 className="my-4 font-semibold text-black dark:text-white">
            Revenue Summary
          </h4>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6 xl:grid-cols-3 2xl:gap-7.5">
            <CardDataStats
              title="For Today"
              periodId="today"
              url={`/dashboard/loans/${encodeURIComponent("today")}`}
              caption="See full list"
              total={`${formatPrice(revenueToday || 0)}`}
            ></CardDataStats>
            <CardDataStats
              periodId="this-month"
              caption="See full list"
              title="For This Month"
              url={`/dashboard/loans/${encodeURIComponent("this-month")}`}
              total={`${formatPrice(revenueMonth || 0)}`}
            ></CardDataStats>
            <CardDataStats
              periodId="this-year"
              caption="See full list"
              title="For This Year"
              url={`/dashboard/loans/${encodeURIComponent("this-year")}`}
              total={`${formatPrice(totalRevenueForYear || 0)}`}
            ></CardDataStats>
          </div>
        </div>
        <div className="w-full">
          <h4 className="my-4 font-semibold text-black dark:text-white">
            Expenses Summary
          </h4>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6 xl:grid-cols-3 2xl:gap-7.5">
            <CardDataStats
              title="For Today"
              periodId="today"
              caption="See full list"
              url={`/dashboard/expenses/all/${encodeURIComponent("today")}`}
              total={`${formatPrice(totalAmountToday || 0)}`}
            ></CardDataStats>
            <CardDataStats
              periodId="this-month"
              caption="See full list"
              url={`/dashboard/expenses/all/${encodeURIComponent(
                "this-month"
              )}`}
              title="For This Month"
              total={`${formatPrice(totalAmountForMonth || 0)}`}
            ></CardDataStats>
            <CardDataStats
              periodId="this-year"
              caption="See full list"
              url={`/dashboard/expenses/all/${encodeURIComponent("this-year")}`}
              title="For This Year"
              total={`${formatPrice(totalAmountForYear || 0)}`}
            ></CardDataStats>
          </div>
        </div>

        {/* <div className="my-4 mx-auto w-full">
            <h4 className="font-semibold text-black dark:text-white">
              Quick Actions
            </h4>
            <div className="mx-auto  mt-4.5 flex items-center justify-center flex-wrap gap-5 xl:gap-7.5">
              <button
                onClick={() =>
                  customer?.websiteReg === true
                    ? toast.error(
                        "Approve customer registration first before creating new loan"
                      )
                    : router.push(
                        `/dashboard/manage-account/${customer?.id}/create-loan`
                      )
                }
                className="inline-flex items-center justify-center rounded-md bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
              >
                Create New Loan
              </button>
              <button
                onClick={() =>
                  customer?.websiteReg === true
                    ? toast.error(
                        "Approve customer registration first, create a loan before recording payments"
                      )
                    : router.push(
                        `/dashboard/manage-account/${customer?.id}/make-payment`
                      )
                }
                className="inline-flex items-center justify-center rounded-md bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
              >
                Record Payment
              </button>
              <button
                onClick={() =>
                  customer?.websiteReg === true
                    ? toast.error(
                        "This customer's registration is yet to be approved and has no open loans"
                      )
                    : router.push(
                        `/dashboard/manage-account/${customer?.id}/approve-loan`
                      )
                }
                className="inline-flex items-center justify-center rounded-md bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
              >
                Manage Loans
              </button>
              <button
                onClick={() =>
                  customer?.websiteReg === true
                    ? toast.error(
                        "This customer registration is yet to be approved and has no events"
                      )
                    : router.push(
                        `/dashboard/manage-account/${customer?.id}/event-logs`
                      )
                }
                className="inline-flex items-center justify-center rounded-md bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
              >
                View Event Logs
              </button>
            </div>
          </div> */}
      </div>
    </div>
    // </div>
  );
};

export default FinancialOverviewClient;
