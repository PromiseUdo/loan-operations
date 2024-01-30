"use client";

import React, { useCallback, useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { formatPrice } from "@/utils/formatPrice";
import Heading from "@/app/components/Heading";
import {
  MdAccessTimeFilled,
  MdCached,
  MdClose,
  MdDelete,
  MdDone,
  MdEdit,
  MdRemoveRedEye,
} from "react-icons/md";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
// import { deleteObject, getStorage, ref } from "firebase/storage";
// import firebaseApp from "@/libs/firebase";
import Status from "@/app/components/Status";
import ActionBtn from "@/app/components/ActionBtn";
import { Customer, Loan } from "@prisma/client";
import moment from "moment";
import { SafeUser } from "@/types/user";
import { TiTimes } from "react-icons/ti";
interface ApproveLoanClientProps {
  loans: Loan[] | null;
  customer: Customer | null;
  currentUser: SafeUser | null;
}

const ApproveLoanClient: React.FC<ApproveLoanClientProps> = ({
  loans,
  customer,
  currentUser,
}) => {
  useEffect(() => {
    if (!currentUser) {
      router.push("/");
      router.refresh();
    }
  }, []);
  const [isTransactionCreated, setIsTransactionCreated] = useState(false);

  const router = useRouter();
  //   const storage = getStorage(firebaseApp);
  let rows: any = [];

  if (loans) {
    rows = loans.map((loan, idx) => {
      return {
        id: loan.id,
        count: idx + 1,
        loanAmount: loan.loanAmount,
        interestRate: loan.interestRate,
        numberOfPeriods: loan.numberOfPeriods,
        servicedPeriods: loan.paidPeriods,
        monthlyPayment: loan.monthlyPayment,
        unpaid: loan.unpaid,
        amountPaid: loan.paid,
        unpaidBal: (loan?.unpaid ?? 0) - (loan?.paid ?? 0),
        interestRevenue: loan.interestRevenue,
        earnedRevenue: loan.earnedRevenue,
        mgmtFee: loan.mgmtFee,
        advisoryFee: loan.advisoryFee,
        legalFee: loan.legalFee,
        insuranceFee: loan.insuranceFee,
        lateFees: loan.lateFees,
        notes: loan.notes,
        approvalStatus: loan.approvalStatus,
        clearedStatus: loan.clearedStatus,
        createdAt: loan.createdAt,
      };
    });
  }

  const columns: GridColDef[] = [
    // {a
    //   field: "id",
    //   headerName: "ID",
    //   width: 220,
    // },
    {
      field: "count",
      headerName: "S/N",
      width: 40,
    },
    {
      field: "loanAmount",
      headerName: "Loan Amount",
      width: 140,
      renderCell: (params) => {
        return (
          <div className="0 text-center">
            {formatPrice(params.row.loanAmount)}
          </div>
        );
      },
    },
    {
      field: "interestRate",
      headerName: "Interest Rate",
      width: 100,
      renderCell: (params) => {
        return (
          <div className="0 text-center">{params.row.interestRate + "%"}</div>
        );
      },
    },
    {
      field: "numberOfPeriods",
      headerName: "Periods",
      width: 70,
    },
    {
      field: "servicedPeriods",
      headerName: "Serviced",
      width: 70,
    },
    {
      field: "monthlyPayment",
      headerName: "Monthly Payment",
      width: 150,
      renderCell: (params) => {
        return (
          <div className="0 text-center">
            {formatPrice(params.row.monthlyPayment)}
          </div>
        );
      },
    },
    {
      field: "unpaid",
      headerName: "Amount+Interest",
      width: 140,
      renderCell: (params) => {
        return (
          <div className="0 text-center">{formatPrice(params.row.unpaid)}</div>
        );
      },
    },
    {
      field: "amountPaid",
      headerName: "Amount Paid",
      width: 140,
      renderCell: (params) => {
        return (
          <div className="0 text-center">
            {formatPrice(params.row.amountPaid)}
          </div>
        );
      },
    },
    {
      field: "unpaidBal",
      headerName: "Unpaid Bal",
      width: 140,
      renderCell: (params) => {
        return (
          <div className="0 text-center">
            {formatPrice(params.row.unpaidBal)}
          </div>
        );
      },
    },
    {
      field: "interestRevenue",
      headerName: "Interest Revenue",
      width: 140,
      renderCell: (params) => {
        return (
          <div className="0 text-center">
            {formatPrice(params.row.interestRevenue)}
          </div>
        );
      },
    },
    {
      field: "earnedRevenue",
      headerName: "Earned Revenue",
      width: 140,
      renderCell: (params) => {
        return (
          <div className="0 text-center">
            {formatPrice(params.row.earnedRevenue)}
          </div>
        );
      },
    },
    {
      field: "mgmtFee",
      headerName: "Mgmt Fee",
      width: 120,
      renderCell: (params) => {
        return (
          <div className="0 text-center">{formatPrice(params.row.mgmtFee)}</div>
        );
      },
    },
    {
      field: "advisoryFee",
      headerName: "Advisory Fee",
      width: 140,
      renderCell: (params) => {
        return (
          <div className="0 text-center">
            {formatPrice(params.row.advisoryFee)}
          </div>
        );
      },
    },
    {
      field: "legalFee",
      headerName: "Legal Fee",
      width: 140,
      renderCell: (params) => {
        return (
          <div className="0 text-center">
            {formatPrice(params.row.legalFee)}
          </div>
        );
      },
    },
    {
      field: "insuranceFee",
      headerName: "Insurance Fee",
      width: 140,
      renderCell: (params) => {
        return (
          <div className="0 text-center">
            {formatPrice(params.row.insuranceFee)}
          </div>
        );
      },
    },
    {
      field: "lateFees",
      headerName: "Late Fees",
      width: 140,
      renderCell: (params) => {
        return (
          <div className="0 text-center">
            {formatPrice(params.row.lateFees)}
          </div>
        );
      },
    },
    {
      field: "notes",
      headerName: "Notes",
      width: 170,
    },
    {
      field: "createdAt",
      headerName: "Created Date",
      width: 190,
      renderCell: (params) => {
        return (
          <div className="0 text-center">
            {moment(params.row.createdAt).format("MMMM D, YYYY h:mm a")}
          </div>
        );
      },
    },

    {
      field: "approvalStatus",
      headerName: "Approval Status",
      width: 130,
      renderCell: (params) => {
        return (
          <div>
            {params.row.approvalStatus === false ? (
              <Status
                text="pending"
                icon={MdAccessTimeFilled}
                bg="bg-slate-200"
                color="text-slate-700"
              />
            ) : params.row.approvalStatus === true ? (
              <Status
                text="approved"
                icon={MdDone}
                bg="bg-green-200"
                color="text-green-700"
              />
            ) : (
              <></>
            )}
          </div>
        );
      },
    },
    {
      field: "clearedStatus",
      headerName: "Cleared",
      width: 130,
      renderCell: (params) => {
        return (
          <div>
            {params.row.clearedStatus === false ? (
              <Status
                text="not cleared"
                icon={TiTimes}
                bg="bg-slate-200"
                color="text-slate-700"
              />
            ) : params.row.clearedStatus === true ? (
              <Status
                text="cleared"
                icon={MdDone}
                bg="bg-green-200"
                color="text-green-700"
              />
            ) : (
              <></>
            )}
          </div>
        );
      },
    },

    {
      field: "action",
      headerName: "Actions",
      width: 120,
      renderCell: (params) => {
        return (
          <div className="flex justify-between gap-4 w-full">
            {params.row.approvalStatus === false && (
              <ActionBtn
                icon={MdCached}
                onClick={() => {
                  handleToggleApproval(
                    params.row.id,
                    params.row.approvalStatus,
                    params.row.loanAmount
                  );
                }}
              />
            )}

            {/* <ActionBtn icon={MdDelete} onClick={() => {}} /> */}
            <ActionBtn
              icon={MdDone}
              onClick={() => {
                handleClearLoan(params.row.id, params.row.clearedStatus);
              }}
            />

            <ActionBtn
              icon={MdEdit}
              onClick={() => {
                router.push(
                  `/dashboard/manage-account/${customer?.id}/approve-loan/${params.row.id}/edit-loan`
                );
              }}
            />
          </div>
        );
      },
    },
  ];

  const handleToggleApproval = useCallback(
    (id: string, approved: boolean, amount: number) => {
      const emailData = {
        emailList: ["info.promiseudo@gmail.com"],
        subject: `Loan Approval`,
        message: `Hello, <br/>Loan application of ${customer?.firstname} ${customer?.lastname} has been approved by admin. <br/> <br/> You can start recording payments. <br/>
        <br/> <a target="_blank" href="https://goldpay-operations.vercel.app/dashboard/manage-account/${customer?.id}/make-payment">Record New Payment from ${customer?.firstname} ${customer?.lastname}</a> <br/>
        <br/>Operator: ${currentUser?.firstname} ${currentUser?.lastname} <br/><br/><small>Goldpay Investment Operations App</small>`,
      };

      if (currentUser?.role !== "ADMIN") {
        toast.error("Only admins can approve loans.");
        return;
      }
      toast("Approving loan. Please wait...");

      const transactionData = {
        customerId: customer?.id,
        operator: `${currentUser?.firstname} ${currentUser?.lastname}`,
        type: "LOANAPPROVAL",
      };

      axios
        .put("/api/create-loan", {
          id,
          approved: !approved,
        })
        .then((res) => {
          // Loan created successfully
          axios
            .post("/api/create-transaction", transactionData)
            .then(() => {
              // Transaction created successfully
              // axios
              //   .post("/api/send-email", emailData)
              //   .then(() => {
              //     console.log("success");
              //     // router.refresh();
              //   })
              //   .catch((error) => {
              //     console.log(error);
              //     toast.error("Error sending email");
              //   });

              toast.success("Loan successfully approved");
              router.refresh();
            })
            .catch((error) => {
              toast.error("Error creating transaction");
            });
        })
        .catch((error) => {
          toast.error("Error creating loan");
        });
    },
    []
  );

  const handleClearLoan = useCallback((id: string, cleared: boolean) => {
    if (currentUser?.role !== "ADMIN") {
      toast.error("Only admins can clear loans.");
      return;
    }

    const loan = loans?.find((loan) => loan.id === id);

    if (loan && loan.paidPeriods !== loan.numberOfPeriods) {
      // Check if paidPeriods is not equal to numberOfPeriods
      toast.error(
        "Cannot mark this loan as cleared. Loan is not completely serviced."
      );
      return;
    }

    toast("Marking loan as cleared. Please wait...");
    const clearedLoanEmailData = {
      emailList: ["info.promiseudo@gmail.com"],
      subject: `Loan Cleared`,
      message: `Hello, <br/>Loan repayments of ${customer?.firstname} ${customer?.lastname} has been  marked as cleared by admin. <br/> 
      <br/>Operator: ${currentUser?.firstname} ${currentUser?.lastname} <br/><br/><small>Goldpay Investment Operations App</small>`,
    };

    const transactionData = {
      customerId: customer?.id,
      operator: `${currentUser?.firstname} ${currentUser?.lastname}`,
      type: "CLEAREDLOAN",
    };

    axios
      .put("/api/clear-loan", {
        id,
        cleared: !cleared,
      })
      .then((res) => {
        router.refresh();
        axios
          .post("/api/send-email", clearedLoanEmailData)
          .then(() => {
            toast.success("Email sent");
            setIsTransactionCreated(true);
          })
          .catch((error) => {
            console.log(error);
            toast.error("Error sending email");
          });

        axios
          .post("/api/create-transaction", transactionData)
          .then(() => {
            setIsTransactionCreated(true);
          })
          .catch((error) => {
            toast.error("Something went wrong when creating new transaction");
          });
      })
      .finally(() => {
        router.refresh();

        toast.success("Loan successfully marked as cleared");
      })
      .catch((error) => {
        toast.error("Something went wrong");
      });
  }, []);

  return (
    <div className="w-full mt-5 m-auto text-xl">
      <div
        style={{
          height: 600,
          width: "100%",
          color: "#f7f7f7",
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 9 },
            },
          }}
          pageSizeOptions={[9, 20]}
          checkboxSelection
          disableRowSelectionOnClick
        />
      </div>
    </div>
  );
};

export default ApproveLoanClient;
