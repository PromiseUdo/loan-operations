"use client";

import { SafeCustomer } from "@/types";
import { SafeUser } from "@/types/user";
import { formatPrice } from "@/utils/formatPrice";
import { Customer, Loan } from "@prisma/client";
import axios from "axios";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { format } from "date-fns";
interface CustomerAccountProps {
  customer: Customer | null;
  loan: Loan | null;
  currentUser: SafeUser | null;
}
const EditLoanClient: React.FC<CustomerAccountProps> = ({
  customer,
  loan,
  currentUser,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoanCreated, setIsLoanCreated] = useState(false);
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const router = useRouter();
  const defaultCreatedAt = loan?.createdAt
    ? format(new Date(loan.createdAt), "yyyy-MM-dd")
    : format(new Date(), "yyyy-MM-dd");

  useEffect(() => {
    if (!currentUser) {
      router.push("/");
      router.refresh();
    }
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      loanAmount: loan?.loanAmount,
      numberOfPeriods: loan?.numberOfPeriods,
      interestRate: loan?.interestRate,
      repaymentPlan: loan?.repaymentPlan,
      notes: loan?.notes,
      approvalStatus: loan?.approvalStatus,
      mgmtFee: loan?.mgmtFee,
      advisoryFee: loan?.advisoryFee,
      legalFee: loan?.legalFee,
      insuranceFee: loan?.insuranceFee,
      interestRevenue: loan?.interestRevenue,
      unpaid: loan?.unpaid,
      paid: loan?.paid,
      createdAt: defaultCreatedAt,
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    // console.log("loan data >>>>>", data);

    setIsLoading(true);

    toast("Updating loan, please wait...");

    const loanData = {
      ...data,
      loanId: loan?.id,
      approvalStatus: false,
      customerId: customer?.id,
      paidPeriods: 0,
      paid: 0,
      clearedStatus: false,
      monthlyPayment: monthlyPayment,
      unpaid: monthlyPayment * data.numberOfPeriods,
      interestRevenue:
        monthlyPayment * data.numberOfPeriods - parseFloat(data.loanAmount),
    };

    const emailData = {
      emailList: ["info.promiseudo@gmail.com"],
      subject: `New Loan Created`,
      message: `Hello, <br/>Loan application for ${customer?.firstname} ${customer?.lastname} has been successfully edited. <br/>
      <br/>Operator: ${currentUser?.firstname} ${currentUser?.lastname} <br/><br/><small>Goldpay Investment Operations App</small>`,
    };

    const transactionData = {
      amount: data.loanAmount,
      otherCharges:
        parseFloat(data.mgmtFee) +
        parseFloat(data.advisoryFee) +
        parseFloat(data.legalFee) +
        parseFloat(data.insuranceFee),
      customerId: customer?.id,
      type: "EDITLOAN",
      operator: `${currentUser?.firstname} ${currentUser?.lastname}`,
    };

    axios
      .put("/api/edit-loan", loanData)
      .then(() => {
        toast.success("Loan successfully updated");
        setIsLoanCreated(true);
        // router.refresh();

        axios
          .post("/api/send-email", emailData)
          .then(() => {
            console.log("success");
            // router.refresh();
          })
          .catch((error) => {
            console.log(error);
            toast.error("Error sending email");
          });

        axios
          .post("/api/create-transaction", transactionData)
          .then(() => {
            // toast.success("Transaction successfully created");
            // setIsLoanCreated(true);
          })
          .catch((error) => {
            toast.error("Something went wrong when creating new transaction");
          });
        router.refresh();
      })
      .catch((error) => {
        toast.error("Something went wrong when creating new loan");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (isLoanCreated) {
      reset();
      setIsLoanCreated(false);
    }
  }, [isLoanCreated]);

  useEffect(() => {
    const loanAmount = parseFloat(watch("loanAmount")) || 0;
    const interestRate = (parseFloat(watch("interestRate")) || 0) / 100;
    const numberOfPeriods = parseFloat(watch("numberOfPeriods")) || 0;

    if (!loanAmount || !interestRate || !numberOfPeriods) {
      setMonthlyPayment(0);
    } else {
      const calculatedMonthlyPayment =
        (loanAmount / numberOfPeriods) * interestRate +
        loanAmount / numberOfPeriods;
      setMonthlyPayment(calculatedMonthlyPayment);
    }
  }, [watch("loanAmount"), watch("interestRate"), watch("numberOfPeriods")]);
  return (
    <div className="col-span-5 xl:col-span-3">
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            Fill out the form
          </h3>
        </div>
        <div className="p-7">
          <p className="mb-4">{`Monthly Payment: ${formatPrice(
            monthlyPayment
          )}`}</p>

          <form action="#">
            <div className="mb-5.5 flex flex-col sm:items-center gap-5.5 sm:flex-row">
              <div className="w-full sm:w-1/2">
                <label
                  className="mb-3 block text-sm font-medium text-black dark:text-white"
                  htmlFor="phoneNumber"
                >
                  Loan Amount
                </label>
                {/* errors[id]
            ? "border-rose-400 focus:border-rose-400"
            : "border-slate-300 focus:border-slate-300" */}
                <input
                  className={clsx(
                    "w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary",
                    errors
                      ? "border-rose-400 focus:border-rose-400"
                      : "border-slate-300 focus:border-slate-300"
                  )}
                  id="loanAmount"
                  disabled={isLoading}
                  {...register("loanAmount", { required: true })}
                  type="number"
                  name="loanAmount"
                  required
                  min={1000}
                  placeholder="Loan Amount"

                  // defaultValue="+990 3343 7865"
                />
              </div>
              <div className="w-full sm:w-1/2">
                <label
                  className="mb-3 block text-sm font-medium text-black dark:text-white"
                  htmlFor="phoneNumber"
                >
                  Number of Period (months)
                </label>
                <input
                  className={clsx(
                    "w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary",
                    errors
                      ? "border-rose-400 focus:border-rose-400"
                      : "border-slate-300 focus:border-slate-300"
                  )}
                  id="numberOfPeriods"
                  disabled={isLoading}
                  {...register("numberOfPeriods", { required: true })}
                  type="number"
                  name="numberOfPeriods"
                  required
                  min={1}
                  placeholder="Number of periods"
                  // defaultValue="+990 3343 7865"
                />
              </div>
            </div>

            <div className="mb-5.5 flex flex-col sm:items-center gap-5.5 sm:flex-row">
              <div className="w-full sm:w-1/2">
                <label
                  className="mb-3 block text-sm font-medium text-black dark:text-white"
                  htmlFor="phoneNumber"
                >
                  Interest Rate
                </label>
                <input
                  className={clsx(
                    "w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary",
                    errors
                      ? "border-rose-400 focus:border-rose-400"
                      : "border-slate-300 focus:border-slate-300"
                  )}
                  id="interestRate"
                  disabled={isLoading}
                  {...register("interestRate", { required: true })}
                  type="number"
                  name="interestRate"
                  required
                  placeholder="Interest Rate"
                  // defaultValue="+990 3343 7865"
                />
              </div>
              {/* <div className="w-full sm:w-1/2">
                <label className="mb-3 block text-black dark:text-white">
                  Repayment Plan
                </label>
                <div className="relative z-20 bg-white dark:bg-form-input">
                  <select
                    id="repaymentPlan"
                    disabled={isLoading}
                    {...register("repaymentPlan", { required: true })}
                    name="repaymentPlan"
                    required
                    className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
                  >
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Yearly">Yearly</option>
                  </select>
                  <span className="absolute top-1/2 right-4 z-10 -translate-y-1/2">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g opacity="0.8">
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                          fill="#637381"
                        ></path>
                      </g>
                    </svg>
                  </span>
                </div>
              </div> */}
              <div>
                <label className="flex items-center mb-3  text-black dark:text-white">
                  <span> Date of Registration</span>
                </label>
                <input
                  id="createdAt"
                  disabled={isLoading}
                  {...register("createdAt", { required: true })}
                  type="date"
                  name="createdAt"
                  required
                  placeholder="Registration Date"
                  className={clsx(
                    "w-60 rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary",
                    errors["createdAt"]
                      ? "border-rose-400 focus:border-rose-400"
                      : "border-slate-300 focus:border-slate-300"
                  )}
                />
              </div>
            </div>
            <div className="mb-5.5 flex flex-col sm:items-center gap-5.5 sm:flex-row">
              <div className="w-full sm:w-1/2">
                <label
                  className="mb-3 block text-sm font-medium text-black dark:text-white"
                  htmlFor="phoneNumber"
                >
                  Mgmt Fee
                </label>
                <input
                  className={clsx(
                    "w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary",
                    errors
                      ? "border-rose-400 focus:border-rose-400"
                      : "border-slate-300 focus:border-slate-300"
                  )}
                  id="mgmtFee"
                  disabled={isLoading}
                  {...register("mgmtFee", { required: true })}
                  type="number"
                  name="mgmtFee"
                  required
                  min={0}
                  placeholder="Management Fee"
                />
              </div>
              <div className="w-full sm:w-1/2">
                <label
                  className="mb-3 block text-sm font-medium text-black dark:text-white"
                  htmlFor="phoneNumber"
                >
                  Advisory Fee
                </label>
                <input
                  className={clsx(
                    "w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary",
                    errors
                      ? "border-rose-400 focus:border-rose-400"
                      : "border-slate-300 focus:border-slate-300"
                  )}
                  id="advisoryFee"
                  disabled={isLoading}
                  {...register("advisoryFee", { required: true })}
                  type="number"
                  name="advisoryFee"
                  required
                  min={0}
                  placeholder="Advisory Fee"
                />
              </div>
            </div>

            <div className="mb-5.5 flex flex-col sm:items-center gap-5.5 sm:flex-row">
              <div className="w-full sm:w-1/2">
                <label
                  className="mb-3 block text-sm font-medium text-black dark:text-white"
                  htmlFor="phoneNumber"
                >
                  Legal Fee
                </label>
                <input
                  className={clsx(
                    "w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary",
                    errors
                      ? "border-rose-400 focus:border-rose-400"
                      : "border-slate-300 focus:border-slate-300"
                  )}
                  id="legalFee"
                  disabled={isLoading}
                  {...register("legalFee", { required: true })}
                  type="number"
                  name="legalFee"
                  required
                  min={0}
                  placeholder="Legal Fee"
                />
              </div>
              <div className="w-full sm:w-1/2">
                <label
                  className="mb-3 block text-sm font-medium text-black dark:text-white"
                  htmlFor="phoneNumber"
                >
                  Insurance Fee
                </label>
                <input
                  className={clsx(
                    "w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary",
                    errors
                      ? "border-rose-400 focus:border-rose-400"
                      : "border-slate-300 focus:border-slate-300"
                  )}
                  id="insuranceFee"
                  disabled={isLoading}
                  {...register("insuranceFee", { required: true })}
                  type="number"
                  name="insuranceFee"
                  required
                  min={0}
                  placeholder="Insurance Fee"
                />
              </div>
            </div>

            <div className="mb-5.5">
              <label
                className="mb-3 block text-sm font-medium text-black dark:text-white"
                htmlFor="Username"
              >
                Notes
              </label>
              <div className="relative">
                <span className="absolute left-4.5 top-4">
                  <svg
                    className="fill-current"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g opacity="0.8" clipPath="url(#clip0_88_10224)">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M1.56524 3.23223C2.03408 2.76339 2.66997 2.5 3.33301 2.5H9.16634C9.62658 2.5 9.99967 2.8731 9.99967 3.33333C9.99967 3.79357 9.62658 4.16667 9.16634 4.16667H3.33301C3.11199 4.16667 2.90003 4.25446 2.74375 4.41074C2.58747 4.56702 2.49967 4.77899 2.49967 5V16.6667C2.49967 16.8877 2.58747 17.0996 2.74375 17.2559C2.90003 17.4122 3.11199 17.5 3.33301 17.5H14.9997C15.2207 17.5 15.4326 17.4122 15.5889 17.2559C15.7452 17.0996 15.833 16.8877 15.833 16.6667V10.8333C15.833 10.3731 16.2061 10 16.6663 10C17.1266 10 17.4997 10.3731 17.4997 10.8333V16.6667C17.4997 17.3297 17.2363 17.9656 16.7674 18.4344C16.2986 18.9033 15.6627 19.1667 14.9997 19.1667H3.33301C2.66997 19.1667 2.03408 18.9033 1.56524 18.4344C1.0964 17.9656 0.833008 17.3297 0.833008 16.6667V5C0.833008 4.33696 1.0964 3.70107 1.56524 3.23223Z"
                        fill=""
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M16.6664 2.39884C16.4185 2.39884 16.1809 2.49729 16.0056 2.67253L8.25216 10.426L7.81167 12.188L9.57365 11.7475L17.3271 3.99402C17.5023 3.81878 17.6008 3.5811 17.6008 3.33328C17.6008 3.08545 17.5023 2.84777 17.3271 2.67253C17.1519 2.49729 16.9142 2.39884 16.6664 2.39884ZM14.8271 1.49402C15.3149 1.00622 15.9765 0.732178 16.6664 0.732178C17.3562 0.732178 18.0178 1.00622 18.5056 1.49402C18.9934 1.98182 19.2675 2.64342 19.2675 3.33328C19.2675 4.02313 18.9934 4.68473 18.5056 5.17253L10.5889 13.0892C10.4821 13.196 10.3483 13.2718 10.2018 13.3084L6.86847 14.1417C6.58449 14.2127 6.28409 14.1295 6.0771 13.9225C5.87012 13.7156 5.78691 13.4151 5.85791 13.1312L6.69124 9.79783C6.72787 9.65131 6.80364 9.51749 6.91044 9.41069L14.8271 1.49402Z"
                        fill=""
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_88_10224">
                        <rect width="20" height="20" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </span>

                <textarea
                  id="notes"
                  disabled={isLoading}
                  {...register("notes", { required: false })}
                  name="notes"
                  required
                  className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                  rows={6}
                  placeholder="Write your notes here"
                  // defaultValue="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque posuere fermentum urna, eu condimentum mauris tempus ut. Donec fermentum blandit aliquet."
                ></textarea>
              </div>
            </div>

            <div className="flex justify-end gap-4.5">
              <button
                onClick={() => router.back()}
                className="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                type="submit"
              >
                Go Back
              </button>
              <button
                disabled={isLoading}
                onClick={handleSubmit(onSubmit)}
                className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-95"
              >
                {isLoading ? "Loading..." : "Update Loan"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditLoanClient;
