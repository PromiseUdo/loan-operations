"use client";

import React, { useCallback, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { formatPrice } from "@/utils/formatPrice";
import Heading from "@/app/components/Heading";
import {
  MdAccessTimeFilled,
  MdCached,
  MdClose,
  MdDelete,
  MdDone,
  MdRemoveRedEye,
} from "react-icons/md";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
// import { deleteObject, getStorage, ref } from "firebase/storage";
// import firebaseApp from "@/libs/firebase";
import Status from "@/app/components/Status";
import ActionBtn from "@/app/components/ActionBtn";
import { Customer, Loan, Transaction } from "@prisma/client";
import moment from "moment";
import { SafeUser } from "@/types/user";
import { TiTimes } from "react-icons/ti";
interface EventLogsClientProps {
  loans: Loan[] | null;
  customer: Customer | null;
  currentUser: SafeUser | null;
  transactions: Transaction[] | null;
}

const EventLogsClient: React.FC<EventLogsClientProps> = ({
  loans,
  customer,
  currentUser,
  transactions,
}) => {
  const [isTransactionCreated, setIsTransactionCreated] = useState(false);

  const router = useRouter();
  //   const storage = getStorage(firebaseApp);
  let rows: any = [];

  if (transactions) {
    rows = transactions.map((transaction, idx) => {
      return {
        id: transaction.id,
        count: idx + 1,
        amount: transaction.amount,
        otherCharges: transaction.otherCharges,
        operator: transaction.operator,
        type: transaction.type,
        createdAt: transaction.createdAt,
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
      field: "amount",
      headerName: "Transaction Amount",
      width: 170,
      renderCell: (params) => {
        return (
          <div className="0 text-center">{formatPrice(params.row.amount)}</div>
        );
      },
    },
    {
      field: "otherCharges",
      headerName: "Other Charges",
      width: 170,
      renderCell: (params) => {
        return (
          <div className="0 text-center">
            {formatPrice(params.row.otherCharges)}
          </div>
        );
      },
    },
    {
      field: "operator",
      headerName: "Operator",
      width: 170,
    },
    {
      field: "type",
      headerName: "Action Type",
      width: 200,
    },
    {
      field: "createdAt",
      headerName: "Action Date",
      width: 190,
      renderCell: (params) => {
        return (
          <div className="0 text-center">
            {moment(params.row.createdAt).format("MMMM D, YYYY h:mm a")}
          </div>
        );
      },
    },

    // {
    //   field: "approvalStatus",
    //   headerName: "Approval Status",
    //   width: 130,
    //   renderCell: (params) => {
    //     return (
    //       <div>
    //         {params.row.approvalStatus === false ? (
    //           <Status
    //             text="pending"
    //             icon={MdAccessTimeFilled}
    //             bg="bg-slate-200"
    //             color="text-slate-700"
    //           />
    //         ) : params.row.approvalStatus === true ? (
    //           <Status
    //             text="approved"
    //             icon={MdDone}
    //             bg="bg-green-200"
    //             color="text-green-700"
    //           />
    //         ) : (
    //           <></>
    //         )}
    //       </div>
    //     );
    //   },
    // },
    // {
    //   field: "clearedStatus",
    //   headerName: "Cleared",
    //   width: 130,
    //   renderCell: (params) => {
    //     return (
    //       <div>
    //         {params.row.clearedStatus === false ? (
    //           <Status
    //             text="not cleared"
    //             icon={TiTimes}
    //             bg="bg-slate-200"
    //             color="text-slate-700"
    //           />
    //         ) : params.row.clearedStatus === true ? (
    //           <Status
    //             text="cleared"
    //             icon={MdDone}
    //             bg="bg-green-200"
    //             color="text-green-700"
    //           />
    //         ) : (
    //           <></>
    //         )}
    //       </div>
    //     );
    //   },
    // },

    // {
    //   field: "action",
    //   headerName: "Actions",
    //   width: 120,
    //   renderCell: (params) => {
    //     return (
    //       <div className="flex justify-between gap-4 w-full">
    //         <ActionBtn
    //           icon={MdCached}
    //           onClick={() => {
    //             handleToggleApproval(params.row.id, params.row.approvalStatus);
    //           }}
    //         />
    //         {/* <ActionBtn icon={MdDelete} onClick={() => {}} /> */}
    //         <ActionBtn
    //           icon={MdDone}
    //           onClick={() => {
    //             handleClearLoan(params.row.id, params.row.clearedStatus);
    //           }}
    //         />
    //       </div>
    //     );
    //   },
    // },
  ];

  const handleToggleApproval = useCallback((id: string, approved: boolean) => {
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
        toast.success("Loan Status Changed");
        router.refresh();
      })
      .catch((error) => {
        toast.error("Something went wrong");
      });

    axios
      .post("/api/create-transaction", transactionData)
      .then(() => {
        // toast.success("Transaction successfully created");
        setIsTransactionCreated(true);
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

  const handleClearLoan = useCallback((id: string, cleared: boolean) => {
    const loan = loans?.find((loan) => loan.id === id);

    if (loan && loan.paidPeriods !== loan.numberOfPeriods) {
      // Check if paidPeriods is not equal to numberOfPeriods
      toast.error(
        "Cannot mark this loan as cleared. Loan is not completely serviced."
      );
      return;
    }

    toast("Marking loan as cleared. Please wait...");

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
        toast.success("Loan marked as cleared");
        router.refresh();
      })
      .catch((error) => {
        toast.error("Something went wrong");
      });

    axios
      .post("/api/create-transaction", transactionData)
      .then(() => {
        // toast.success("Transaction successfully created");
        setIsTransactionCreated(true);
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

export default EventLogsClient;
