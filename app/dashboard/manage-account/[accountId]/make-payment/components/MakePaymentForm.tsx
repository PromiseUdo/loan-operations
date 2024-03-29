"use client";
import { SafeUser } from "@/types/user";
import { formatPrice } from "@/utils/formatPrice";
import { Customer, Loan, User } from "@prisma/client";
import axios from "axios";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
interface MakePaymentProps {
  loan: Loan | null;
  customerId: String;
  currentUser: SafeUser | null;
  customer: Customer | null;
}
const MakePaymentForm: React.FC<MakePaymentProps> = ({
  loan,
  customerId,
  currentUser,
  customer,
}) => {
  useEffect(() => {
    if (!currentUser) {
      router.push("/");
      router.refresh();
    }
  }, []);
  const [isLoading, setIsLoading] = useState(false);
  const [isPaymentCreated, setIsPaymentCreated] = useState(false);
  const [isOneOffPayment, setIsOneOffPayment] = useState(false);

  const router = useRouter();
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
      amount: "",
      lateFee: "",
      notes: "",
      actualPaymentDate: "",
      nextPaymentDate: "",
      isOneOffPayment: false, // Default value for checkbox
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    console.log("payment data >>>>>", data);

    // Check if the loan has been approved
    if (loan?.approvalStatus !== true) {
      toast.error(
        "Cannot record payment for an unapproved loan. Please contact the admin for assistance."
      );
      return;
    }

    // Check if the loan has been fully serviced
    if (loan?.paidPeriods === loan?.numberOfPeriods) {
      toast.error(
        "This loan has been fully serviced. No more payments are allowed."
      );
      return;
    }

    setIsLoading(true);

    toast("Recording payment, please wait...");
    const interestRate = loan?.interestRate / 100;
    const ratePerMonth = interestRate / loan?.numberOfPeriods;
    const interestPerMonth = loan?.loanAmount * ratePerMonth;

    let earnedRevenue = 0;
    if (data.amount > loan?.loanAmount / loan.numberOfPeriods) {
      earnedRevenue = data.amount - loan?.loanAmount / loan.numberOfPeriods;
    } else {
      earnedRevenue = 0;
    }

    const paymentData = {
      ...data,
      loanId: loan?.id,
      interestRevenue: earnedRevenue + parseFloat(data.lateFee),
      operator: `${currentUser?.firstname} ${currentUser?.lastname}`,
      active: true,
      customerId: customerId,
    };

    const updateLoanData = {
      id: loan?.id,
      paid: data.amount,
      lateFees: data.lateFee,
      earnedRevenue: earnedRevenue,
      isOneOffPayment: isOneOffPayment,
    };

    const transactionData = {
      amount: data.amount,
      customerId: customerId,
      operator: `${currentUser?.firstname} ${currentUser?.lastname}`,
      type: "PAYMENT",
    };
    const emailData = {
      emailList: ["info.promiseudo@gmail.com"],
      subject: `New Payment`,
      message: `New loan payment recorded for ${customer?.firstname} ${
        customer?.lastname
      }. <br/> <br/> Amount recorded ${formatPrice(
        data.amount
      )}. <br/>Operator: ${currentUser?.firstname} ${
        currentUser?.lastname
      } <br/><br/><small>Loanpay App</small>`,
    };

    // `Dear Sir, please kindly review and approve customer's payment. Click on the link below <br/> <a target="_blank" href="https://goldpay-operations.vercel.app/dashboard/manage-account/${customerId}/payment-history">Payment list</a> <br/>Goldpay Investment Operations`,

    try {
      setIsLoading(true);

      const [paymentRes, updateLoanRes, transactionRes] = await Promise.all([
        axios.post("/api/make-payment", paymentData),
        axios.put("/api/update-loan-payment", updateLoanData),
        axios.post("/api/create-transaction", transactionData),
      ]);

      toast.success("Payment successfully recorded");
      setIsPaymentCreated(true);
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }

    // axios
    //   .post("/api/send-email", emailData)
    //   .then(() => {
    //     toast.success("Email sent");
    //     router.refresh();
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //     toast.error(
    //       "Something went wrong when approving customer registration"
    //     );
    //   });
  };

  useEffect(() => {
    if (isPaymentCreated) {
      reset();
      setIsPaymentCreated(false);
      setIsOneOffPayment(false);
    }
  }, [isPaymentCreated]);

  return (
    <div className="col-span-5 xl:col-span-3">
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex items-center justify-between w-full border-b border-stroke py-4 px-7 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            Fill out the form
          </h3>

          <Link
            className="hover:underline"
            href={`/dashboard/manage-account/${customerId}/payment-history`}
          >
            <h3>{`Payments: ${loan?.paidPeriods}/${loan?.numberOfPeriods}`}</h3>
          </Link>
        </div>
        <div className="p-7">
          <form action="#">
            <h3 className="mb-4">{`Monthly Payment: ${formatPrice(
              loan?.monthlyPayment || 0
            )} `}</h3>
            <div className="mb-5.5 flex flex-col sm:items-center gap-5.5">
              <div className="w-full">
                <label
                  className="mb-3 block text-sm font-medium text-black dark:text-white"
                  htmlFor="amount"
                >
                  Amount
                </label>
                <input
                  className={clsx(
                    "w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary",
                    errors
                      ? "border-rose-400 focus:border-rose-400"
                      : "border-slate-300 focus:border-slate-300"
                  )}
                  id="amount"
                  disabled={isLoading}
                  {...register("amount", { required: true })}
                  type="number"
                  name="amount"
                  min={0}
                  placeholder="Amount"
                />
              </div>
              <div className="w-full flex items-center">
                <input
                  id="isOneOffPayment"
                  type="checkbox"
                  {...register("isOneOffPayment")}
                  checked={isOneOffPayment}
                  onChange={(e) => setIsOneOffPayment(e.target.checked)}
                  disabled={isLoading}
                  className="mr-2"
                />
                <label
                  htmlFor="isOneOffPayment"
                  className="text-sm font-medium text-black dark:text-white"
                >
                  One-off Payment
                </label>
              </div>
              <div className="w-full">
                <label
                  className="mb-3 block text-sm font-medium text-black dark:text-white"
                  htmlFor="lateFee"
                >
                  Late Fees
                </label>
                <input
                  className={clsx(
                    "w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary",
                    errors
                      ? "border-rose-400 focus:border-rose-400"
                      : "border-slate-300 focus:border-slate-300"
                  )}
                  id="lateFee"
                  disabled={isLoading}
                  {...register("lateFee", { required: false })}
                  type="number"
                  name="lateFee"
                  min={-1}
                  placeholder="Late Fee Amount"
                />
              </div>
            </div>

            <div className="w-full mb-5.5 flex  sm:items-center gap-5.5">
              <div className="w-full sm:w-1/2">
                <label className="flex items-center mb-3  text-black dark:text-white">
                  <span>Actual Date of Payment</span>
                </label>
                <input
                  id="actualPaymentDate"
                  disabled={isLoading}
                  {...register("actualPaymentDate", { required: true })}
                  type="date"
                  name="actualPaymentDate"
                  required
                  className={clsx(
                    "w-60 rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary",
                    errors["actualPaymentDate"]
                      ? "border-rose-400 focus:border-rose-400"
                      : "border-slate-300 focus:border-slate-300"
                  )}
                />
              </div>
              <div className="w-full sm:w-1/2">
                <label className="flex items-center mb-3  text-black dark:text-white">
                  <span> Next Repayment Date</span>
                </label>
                <input
                  id="nextPaymentDate"
                  disabled={isLoading}
                  {...register("nextPaymentDate", { required: false })}
                  type="date"
                  name="nextPaymentDate"
                  required
                  className={clsx(
                    "w-60 rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary",
                    errors["nextPaymentDate"]
                      ? "border-rose-400 focus:border-rose-400"
                      : "border-slate-300 focus:border-slate-300"
                  )}
                />
              </div>
            </div>

            <div className="mb-5.5">
              <label
                className="mb-3 block text-sm font-medium text-black dark:text-white"
                htmlFor="notes"
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
                  className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                  rows={6}
                  id="notes"
                  disabled={isLoading}
                  {...register("notes", { required: false })}
                  name="notes"
                  required
                  placeholder="Attach any notes here"
                ></textarea>
              </div>
            </div>

            <div className="flex justify-end gap-4.5">
              <button
                onClick={() => router.back()}
                className="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                type="submit"
              >
                Cancel
              </button>
              <button
                disabled={isLoading}
                onClick={handleSubmit(onSubmit)}
                className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-95"
                type="submit"
              >
                {isLoading ? "Loading..." : "Record Payment"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MakePaymentForm;
