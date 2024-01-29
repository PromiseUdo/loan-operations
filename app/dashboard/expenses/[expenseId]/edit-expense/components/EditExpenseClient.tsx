"use client";

import { Customer, Expense, Loan } from "@prisma/client";
import axios from "axios";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { SafeUser } from "@/types/user";
import { formatPrice } from "@/utils/formatPrice";
import SelectImage from "@/app/components/inputs/SelectImage";
import { ImageType, UploadedImageType } from "@/types/image";
import firebaseApp from "@/libs/firebase";

import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
interface CustomerAccountProps {
  currentUser: SafeUser | null;
  expense: Expense | null;
}
const EditExpenseForm: React.FC<CustomerAccountProps> = ({
  currentUser,
  expense,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isExpenseCreated, setIsExpenseCreated] = useState(false);
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [expenseReceiptImage, setExpenseReceiptImage] =
    useState<ImageType | null>();
  const router = useRouter();
  const defaultCreatedAt = format(new Date(), "yyyy-MM-dd");
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
      amount: expense?.amount,
      desc: expense?.desc,
      notes: expense?.notes,
      chequeNo: expense?.chequeNo,
      expenseReceipt: expense?.expenseReceipt,
      vendor: expense?.vendor,
      approved: expense?.approved,
    },
  });

  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  useEffect(() => {
    setCustomValue("expenseReceipt", expenseReceiptImage);
  }, [expenseReceiptImage]);

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    toast("Updating expense, please wait...");

    setIsLoading(true);
    let uploadedExpenseReceiptImage: UploadedImageType = "";

    const handleImageUploads = async () => {
      try {
        // for (const item of data.images) {
        if (data.expenseReceipt) {
          const fileName =
            new Date().getTime() + "-" + data.expenseReceipt.name;
          const storage = getStorage(firebaseApp);
          const storageRef = ref(storage, `customer/${fileName}`);
          const uploadTask = uploadBytesResumable(
            storageRef,
            data.expenseReceipt
          );

          await new Promise<void>((resolve, reject) => {
            uploadTask.on(
              "state_changed",
              (snapshot) => {
                const progress =
                  (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log("Upload is " + progress + "% done");
                switch (snapshot.state) {
                  case "paused":
                    console.log("Upload is paused");
                    break;
                  case "running":
                    console.log("Upload is running");
                    break;
                }
              },
              (error) => {
                // Handle unsuccessful uploads
                console.log("Error uploading customer image", error);
                reject(error);
              },
              () => {
                getDownloadURL(uploadTask.snapshot.ref)
                  .then((downloadURL) => {
                    uploadedExpenseReceiptImage = downloadURL;

                    console.log("File available at", downloadURL);
                    resolve();
                  })
                  .catch((error) => {
                    console.log("error getting the download URL", error);
                    reject(error);
                  });
              }
            );
          });
        }
      } catch (error) {
        setIsLoading(false);
        console.log("Error handling image uploads", error);
        return toast.error("Error handling image uploads");
      }
    };

    await handleImageUploads();

    const expenseData = {
      ...data,
      expenseId: expense?.id,
      operator: `${currentUser?.firstname} ${currentUser?.lastname}`,
      // expenseReceipt: uploadedExpenseReceiptImage,
      // approved: expense.approved,
    };

    const transactionData = {
      amount: data.amount,
      type: "UPDATEEXPENSE",
      operator: `${currentUser?.firstname} ${currentUser?.lastname}`,
    };

    axios
      .put("/api/create-expense", expenseData)
      .then(() => {
        toast.success("Expense successfully updated");
        setIsExpenseCreated(true);
        router.back();
      })
      .catch((error) => {
        toast.error("Something went wrong when creating new loan");
      })
      .finally(() => {
        setIsLoading(false);
      });

    axios
      .post("/api/create-transaction", transactionData)
      .then(() => {
        // toast.success("Transaction successfully created");
        // setIsLoanCreated(true);
        router.refresh();
      })
      .catch((error) => {
        toast.error("Something went wrong when creating new transaction");
      })
      .finally(() => {
        // setIsLoading(false);
        console.log("transaction created");
      });
  };

  useEffect(() => {
    if (isExpenseCreated) {
      reset();
      setIsExpenseCreated(false);
      setExpenseReceiptImage(null);
    }
  }, [isExpenseCreated]);

  const addExpenseReceiptToState = useCallback((value: ImageType) => {
    setExpenseReceiptImage(value);
  }, []);

  const removeExpenseReceiptFromState = useCallback((value: ImageType) => {
    setExpenseReceiptImage(null);
  }, []);

  return (
    <div className="col-span-5 xl:col-span-3">
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            Fill out the form
          </h3>
        </div>
        <div className="p-7">
          <form action="#">
            <div className="mb-5.5 flex flex-col sm:items-center gap-5.5 sm:flex-row">
              <div className="w-full sm:w-1/2">
                <label
                  className="mb-3 block text-sm font-medium text-black dark:text-white"
                  htmlFor="amount"
                >
                  Expense Amount
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
                  id="amount"
                  disabled={isLoading}
                  {...register("amount", { required: true })}
                  type="number"
                  name="amount"
                  required
                  min={1000}
                  placeholder="Expense Amount"

                  // defaultValue="+990 3343 7865"
                />
              </div>
              <div className="w-full sm:w-1/2">
                <label
                  className="mb-3 block text-sm font-medium text-black dark:text-white"
                  htmlFor="chequeNo"
                >
                  Corresponding Cheque No.
                </label>
                <input
                  className={clsx(
                    "w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary",
                    errors
                      ? "border-rose-400 focus:border-rose-400"
                      : "border-slate-300 focus:border-slate-300"
                  )}
                  id="chequeNo"
                  disabled={isLoading}
                  {...register("chequeNo", { required: false })}
                  type="text"
                  name="chequeNo"
                  required
                  placeholder="Cheque No."
                  // defaultValue="+990 3343 7865"
                />
              </div>
            </div>
            <div className="mb-5.5 flex flex-col sm:items-center gap-5.5 sm:flex-row">
              <div className="w-full sm:w-1/2 ">
                <label
                  className="mb-3 block text-sm font-medium text-black dark:text-white"
                  htmlFor="desc"
                >
                  Expense Name{" "}
                </label>
                <input
                  className={clsx(
                    "w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary",
                    errors
                      ? "border-rose-400 focus:border-rose-400"
                      : "border-slate-300 focus:border-slate-300"
                  )}
                  id="desc"
                  disabled={isLoading}
                  {...register("desc", { required: true })}
                  type="text"
                  name="desc"
                  required
                  placeholder="Expense Name"
                  // defaultValue="+990 3343 7865"
                />
              </div>
              <div className="w-full sm:w-1/2">
                <label
                  className="mb-3 block text-sm font-medium text-black dark:text-white"
                  htmlFor="vendor"
                >
                  Vendor Name{" "}
                </label>
                <input
                  className={clsx(
                    "w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary",
                    errors
                      ? "border-rose-400 focus:border-rose-400"
                      : "border-slate-300 focus:border-slate-300"
                  )}
                  id="vendor"
                  disabled={isLoading}
                  {...register("vendor", { required: true })}
                  type="text"
                  name="vendor"
                  required
                  placeholder="Expense Name"
                  // defaultValue="+990 3343 7865"
                />
              </div>
            </div>
            {/* <div className="mb-5.5 flex flex-col sm:items-center gap-5.5 sm:flex-row">
              <div className="flex flex-col">
                <div className="flex items-center">
                  <div className="block">
                    <SelectImage
                      item={null}
                      addImageToState={addExpenseReceiptToState}
                      removeImageFromState={removeExpenseReceiptFromState}
                      isUserCreated={isExpenseCreated}
                      label="Upload Expense Receipt"
                    />
                  </div>
                </div>
              </div>
            </div> */}

            <div className="mb-5.5">
              <label
                className="mb-3 block text-sm font-medium text-black dark:text-white"
                htmlFor="notes"
              >
                Additional Notes
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
                onClick={handleSubmit(onSubmit)}
                className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-95"
              >
                {isLoading ? "Loading..." : "Update Expense"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditExpenseForm;
