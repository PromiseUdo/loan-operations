"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { SafeCustomer } from "@/types";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/utils/formatPrice";
import { Customer, Expense, Loan } from "@prisma/client";
import { IoMdCloseCircle } from "react-icons/io";
import { FaDownload } from "react-icons/fa6";
import toast from "react-hot-toast";
import axios from "axios";
import { AiFillEdit } from "react-icons/ai";
import { SafeUser } from "@/types/user";
import CardDataStats from "@/app/dashboard/manage-account/[accountId]/components/CardDataStats";
import moment from "moment";

interface ManageCustomerClientProps {
  expense: Expense | null;
  currentUser: SafeUser | null;
}

const ViewExpenseClient: React.FC<ManageCustomerClientProps> = ({
  currentUser,
  expense,
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

  const handleImageClick = (image: string) => {
    setIsModalOpen(true);
    setSelectedImage(image);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage("");
  };

  const handleApproveExpense = useCallback(() => {
    toast.success("Approving customer registration. Please wait...");

    setIsLoading(true);
    const data = {
      expenseId: expense?.id,
      approval: true,
    };

    const transactionData = {
      expenseId: expense?.id,
      operator: `${currentUser?.firstname} ${currentUser?.lastname}`,
      type: "EXPENSEAPPROVAL",
    };

    // Make a PUT request to approve registration
    axios
      .put("/api/approve-registration", data)
      .then(() => {
        toast.success("Customer registration successfully approved");
        router.refresh();
      })
      .catch((error) => {
        console.log(error);
        toast.error(
          "Something went wrong when approving customer registration"
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
    axios
      .post("/api/create-transaction", transactionData)
      .then(() => {
        // toast.success("Transaction successfully created");
        // setIsTransactionCreated(true);
        router.refresh();
      })
      .catch((error) => {
        toast.error("Something went wrong when creating new transaction");
      })
      .finally(() => {
        // setIsLoading(false);
        console.log("transaction created");
      });
  }, []);

  return (
    <div className="overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="mt-4 px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
        {expense?.expenseReceipt && (
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="rounded-lg overflow-hidden relative h-[15rem] w-[13rem]">
              <Image
                src={expense?.expenseReceipt}
                alt="Profile"
                style={{ cursor: "pointer" }}
                layout="fill"
                objectFit="cover"
                onClick={() => handleImageClick(expense?.expenseReceipt!)}
              />
            </div>
            <div className="flex w-full items-center justify-center">
              <label>Expense Receipt</label>
            </div>
          </div>
        )}

        <div className="mt-4">
          <div className="flex flex-col items-center justify-center gap-2">
            <h3 className="mb-1.5 text-2xl font-semibold text-black dark:text-white">
              {formatPrice(expense?.amount!)}
            </h3>

            <h3 className="mb-1.5 text-xl font-medium text-black dark:text-white">
              {`${expense?.desc} on ${moment(expense?.createdAt).format(
                "MMMM D, YYYY h:mm a"
              )}`}
            </h3>
            <p className="font-medium">{expense?.operator}</p>
            {expense?.approved === true ? (
              <button
                disabled={isLoading}
                onClick={handleApproveExpense}
                className="flex items-center h-10 gap-2 text-sm justify-center rounded bg-primary p-3 font-medium text-gray"
              >
                {isLoading ? "Approving..." : "Approve Registration"}
              </button>
            ) : (
              <button
                onClick={() =>
                  router.push(
                    `/dashboard/manage-account/${expense?.id}/edit-account`
                  )
                }
                disabled={isLoading}
                className="flex items-center h-10 gap-2 text-sm justify-center rounded bg-primary p-3 font-medium text-gray"
              >
                <AiFillEdit />
                <span> Edit Expense</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed top-[53%] left-[60%] transform -translate-x-1/2 -translate-y-1/2 z-[9990] w-[50%] h-[80%] flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-transparent p-4 h-full w-full rounded-md max-w-2xl max-h-2xl overflow-auto relative">
            <Image
              src={selectedImage}
              alt="Larger Profile"
              className="w-full h-auto"
              layout="fill"
              objectFit="contain" // Adjust the objectFit property based on your design preference
            />
            <button
              className="absolute top-2 right-2 text-white cursor-pointer"
              onClick={closeModal}
            >
              <IoMdCloseCircle size={25} color="#f7f7f7" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewExpenseClient;
