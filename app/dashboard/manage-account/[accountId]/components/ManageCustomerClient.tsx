"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { SafeCustomer } from "@/types";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/utils/formatPrice";
import CardDataStats from "./CardDataStats";
import { Customer, Loan } from "@prisma/client";
import { IoMdCloseCircle } from "react-icons/io";
import { FaDownload } from "react-icons/fa6";
import toast from "react-hot-toast";
import axios from "axios";
import { AiFillEdit } from "react-icons/ai";
import { SafeUser } from "@/types/user";

interface ManageCustomerClientProps {
  customer: Customer | null;
  loans: Loan[] | null;
  unpaidLoan: Loan | null;
  currentUser: SafeUser | null;
}

const ManageCustomerClient: React.FC<ManageCustomerClientProps> = ({
  customer,
  loans,
  currentUser,
  unpaidLoan,
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
  const approvedLoansCount = useMemo(
    () => loans?.filter((loan) => loan.approvalStatus === true).length,
    [loans]
  );
  const clearedLoansCount = useMemo(
    () => loans?.filter((loan) => loan.clearedStatus === true).length,
    [loans]
  );
  const pendingLoansCount = useMemo(
    () => loans?.filter((loan) => loan.approvalStatus === false).length,
    [loans]
  );
  const totalLoanAmount = useMemo(
    () =>
      loans?.reduce((total, loan) => total + (loan.loanAmount || 0), 0) || 0,
    [loans]
  );
  const totalAmountPaid = useMemo(
    () => loans?.reduce((total, loan) => total + (loan.paid || 0), 0) || 0,
    [loans]
  );
  const totalRevenue = useMemo(
    () =>
      loans
        ?.filter((loan) => loan.clearedStatus === true)
        .reduce((total, loan) => total + (loan.interestRevenue || 0), 0) || 0,
    [loans]
  );

  const totalUnpaidBalance = useMemo(
    () =>
      loans
        ?.filter((loan) => loan.clearedStatus === false)
        .reduce(
          (totalUnpaid, loan) =>
            totalUnpaid + (loan.unpaid || 0) - (loan.paid || 0),
          0
        ) || 0,
    [loans]
  );

  const currentLoanAmount = useMemo(
    () =>
      loans
        ?.filter((loan) => loan.clearedStatus === false)
        .reduce((total, loan) => total + (loan.loanAmount || 0), 0) || 0,
    [loans]
  );

  const handleImageClick = (image: string) => {
    setIsModalOpen(true);
    setSelectedImage(image);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage("");
  };

  const handleApproveRegistration = useCallback(() => {
    toast.success("Approving customer registration. Please wait...");

    setIsLoading(true);
    const data = {
      customerId: customer?.id,
      websiteReg: false,
    };

    const transactionData = {
      customerId: customer?.id,
      operator: `${currentUser?.firstname} ${currentUser?.lastname}`,
      type: "ACCOUNTAPPROVAL",
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
        <div
          style={{
            background: `url(${
              customer?.customerPassport || "/defaultImage.png"
            })`,
            backgroundPosition: "center",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
          }}
          className="relative z-30 mx-auto  h-30 w-full max-w-30 rounded-full bg-white/20 p-1 backdrop-blur sm:h-44 sm:max-w-44 sm:p-3"
        ></div>
        <div className="mt-4">
          <div className="flex flex-col items-center justify-center gap-2">
            <h3 className="mb-1.5 text-2xl font-semibold text-black dark:text-white">
              {`${customer?.firstname} ${customer?.lastname}`}
            </h3>
            <p className="font-medium">{customer?.role}</p>
            {customer?.websiteReg === true ? (
              <button
                disabled={isLoading}
                onClick={handleApproveRegistration}
                className="flex items-center h-10 gap-2 text-sm justify-center rounded bg-primary p-3 font-medium text-gray"
              >
                {isLoading ? "Approving..." : "Approve Registration"}
              </button>
            ) : (
              <button
                onClick={() =>
                  router.push(
                    `/dashboard/manage-account/${customer?.id}/edit-account`
                  )
                }
                disabled={isLoading}
                className="flex items-center h-10 gap-2 text-sm justify-center rounded bg-primary p-3 font-medium text-gray"
              >
                <AiFillEdit />
                <span> Edit Customer</span>
              </button>
            )}
          </div>

          <div className="my-4 mx-auto w-full">
            <h4 className="font-semibold text-black dark:text-white">
              Quick Actions
            </h4>
            <div className="mx-auto  mt-4.5 flex items-center justify-center flex-wrap gap-5 xl:gap-7.5">
              <button
                // disabled={customer?.websiteReg === true}
                onClick={() =>
                  customer?.websiteReg === true
                    ? toast.error(
                        "Approve customer registration first before creating new loan"
                      )
                    : router.push(
                        `/dashboard/manage-account/${customer?.id}/create-loan`
                      )
                }
                className="inline-flex items-center justify-center rounded-md bg-[#ED0800] py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
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
                className="inline-flex items-center justify-center rounded-md bg-[#33b249] py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
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
                className="inline-flex items-center justify-center rounded-md bg-[#001457] py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
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
                className="inline-flex items-center justify-center rounded-md bg-[#291820] py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
              >
                View Event Logs
              </button>
            </div>
          </div>

          <div className="w-full">
            <h4 className="my-4 font-semibold text-black dark:text-white">
              Account Stats
            </h4>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
              <CardDataStats
                title="Total Applications"
                total={`${loans?.length || 0}`}
              ></CardDataStats>
              <CardDataStats
                title="Loan Granted"
                total={`${approvedLoansCount || 0}`}
              ></CardDataStats>
              <CardDataStats
                title="Loan Pending"
                total={`${pendingLoansCount || 0} `}
              ></CardDataStats>
              <CardDataStats
                title="Loan Cleared"
                total={`${clearedLoansCount || 0}`}
              ></CardDataStats>

              <CardDataStats
                title="Amount Borrowed"
                total={formatPrice(unpaidLoan?.loanAmount || 0)}
              ></CardDataStats>
              <CardDataStats
                title="Amount Paid"
                total={formatPrice(unpaidLoan?.paid || 0)}
              ></CardDataStats>

              <CardDataStats
                title="Expected Revenue"
                total={formatPrice(unpaidLoan?.interestRevenue || 0)}
              ></CardDataStats>
              <CardDataStats
                title="Earned Revenue"
                total={formatPrice(unpaidLoan?.earnedRevenue || 0)}
              ></CardDataStats>
              <CardDataStats
                title="Unearned Revenue"
                total={formatPrice(
                  (unpaidLoan?.interestRevenue || 0) -
                    (unpaidLoan?.earnedRevenue || 0)
                )}
              ></CardDataStats>
              <CardDataStats
                title="Unpaid Balance"
                total={formatPrice(totalUnpaidBalance || 0)}
              ></CardDataStats>
            </div>
          </div>

          {/* other details */}
          <div className="w-full">
            <h4 className="my-4 font-semibold text-black dark:text-white">
              Attachments{" "}
            </h4>

            <div className="grid grid-cols-4 gap-4">
              {customer?.customerPassport && (
                <div>
                  <div className="rounded-lg overflow-hidden relative h-[15rem] w-[13rem]">
                    <Image
                      src={customer.customerPassport}
                      alt="Profile"
                      style={{ cursor: "pointer" }}
                      layout="fill"
                      objectFit="cover"
                      onClick={() =>
                        handleImageClick(customer.customerPassport!)
                      }
                    />
                  </div>

                  <div className="flex w-full items-center justify-center">
                    <label>Customer Passport</label>
                  </div>
                </div>
              )}
              {customer?.guarantorPassport1 && (
                <div>
                  <div className="rounded-lg overflow-hidden relative h-[15rem] w-[13rem]">
                    <Image
                      src={customer?.guarantorPassport1}
                      alt="Profile"
                      style={{ cursor: "pointer" }}
                      layout="fill"
                      objectFit="cover"
                      onClick={() =>
                        handleImageClick(customer?.guarantorPassport1!)
                      }
                    />
                  </div>
                  <div className="flex w-full items-center justify-center">
                    <label>Guarantor 1 Passport</label>
                  </div>
                </div>
              )}
              {customer?.guarantorPassport2 && (
                <div>
                  <div className="rounded-lg overflow-hidden relative h-[15rem] w-[13rem]">
                    <Image
                      src={customer?.guarantorPassport2}
                      alt="Profile"
                      style={{ cursor: "pointer" }}
                      layout="fill"
                      objectFit="cover"
                      onClick={() =>
                        handleImageClick(customer?.guarantorPassport2!)
                      }
                    />
                  </div>
                  <div className="flex w-full items-center justify-center">
                    <label>Guarantor 2 Passport</label>
                  </div>
                </div>
              )}
              {customer?.customerIdentification && (
                <div>
                  <div className="rounded-lg overflow-hidden relative h-[15rem] w-[13rem]">
                    <Image
                      src={customer?.customerIdentification}
                      alt="Profile"
                      style={{ cursor: "pointer" }}
                      layout="fill"
                      objectFit="cover"
                      onClick={() =>
                        handleImageClick(customer?.customerIdentification!)
                      }
                    />
                  </div>
                  <div className="flex w-full items-center justify-center">
                    <label>Customer Identification</label>
                  </div>
                </div>
              )}
              {customer?.proofOfResidence && (
                <div>
                  <div className="rounded-lg overflow-hidden relative h-[15rem] w-[13rem]">
                    <Image
                      src={customer?.proofOfResidence}
                      alt="Profile"
                      style={{ cursor: "pointer" }}
                      layout="fill"
                      objectFit="cover"
                      onClick={() =>
                        handleImageClick(customer?.proofOfResidence!)
                      }
                    />
                  </div>
                  <div className="flex w-full items-center justify-center">
                    <label>Proof of Residence</label>
                  </div>
                </div>
              )}

              {customer?.cacDocument && (
                <div>
                  <a
                    download={true}
                    href={customer?.cacDocument}
                    className="flex items-center h-10 gap-2 text-sm justify-center rounded bg-primary p-3 font-medium text-gray"
                  >
                    <FaDownload size={20} />
                    <span> Download CAC document</span>
                  </a>
                </div>
              )}
            </div>
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

export default ManageCustomerClient;
