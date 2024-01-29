"use client";

import React, { useCallback, useEffect } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { formatPrice } from "@/utils/formatPrice";
import Heading from "@/app/components/Heading";
import {
  MdAccessTimeFilled,
  MdCached,
  MdClose,
  MdDelete,
  MdDone,
  MdEditNote,
  MdRemoveRedEye,
} from "react-icons/md";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import ActionBtn from "@/app/components/ActionBtn";
import { Customer, Expense } from "@prisma/client";
import { SafeUser } from "@/types/user";
import moment from "moment";
import Status from "@/app/components/Status";
interface AllExpensesClientProps {
  currentUser: SafeUser | null;
  expenses: Expense[];
}

const AllExpensesClient: React.FC<AllExpensesClientProps> = ({
  currentUser,
  expenses,
}) => {
  const router = useRouter();

  useEffect(() => {
    if (!currentUser) {
      router.push("/");
      router.refresh();
    }
  }, []);

  //   const storage = getStorage(firebaseApp);
  let rows: any = [];

  if (expenses) {
    rows = expenses.map((expense, idx) => {
      return {
        id: expense.id,
        count: idx + 1,
        desc: expense.desc,
        amount: expense.amount,
        chequeNo: expense.chequeNo,
        notes: expense.notes,
        operator: expense.operator,
        createdAt: expense.createdAt,
        category: expense.category,
        vendor: expense.vendor,
        approved: expense.approved,
      };
    });
  }

  const columns: GridColDef[] = [
    {
      field: "count",
      headerName: "S/N",
      width: 40,
    },

    {
      field: "desc",
      headerName: "Description",
      width: 150,
    },
    {
      field: "amount",
      headerName: "Amount",
      width: 150,
      renderCell: (params) => {
        return (
          <div className="0 text-center">{formatPrice(params.row.amount)}</div>
        );
      },
    },
    {
      field: "category",
      headerName: "Category",
      width: 150,
    },
    {
      field: "chequeNo",
      headerName: "Cheque No",
      width: 150,
    },
    {
      field: "notes",
      headerName: "notes",
      width: 220,
    },
    {
      field: "vendor",
      headerName: "Vendor",
      width: 100,
    },
    {
      field: "operator",
      headerName: "operator",
      width: 120,
    },
    {
      field: "createdAt",
      headerName: "Created On",
      width: 120,
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
            {params.row.approved === false ? (
              <Status
                text="pending"
                icon={MdAccessTimeFilled}
                bg="bg-slate-200"
                color="text-slate-700"
              />
            ) : params.row.approved === true ? (
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
      field: "action",
      headerName: "Actions",
      width: 130,
      renderCell: (params) => {
        return (
          <div className="flex justify-between gap-4 w-full">
            <ActionBtn
              icon={MdEditNote}
              onClick={() => {
                router.push(
                  `/dashboard/expenses/${params.row.id}/edit-expense`
                );
              }}
            />
            <ActionBtn
              icon={MdRemoveRedEye}
              onClick={() => {
                router.push(`/dashboard/expenses/${params.row.id}`);
              }}
            />

            <ActionBtn
              icon={MdCached}
              onClick={() => {
                handleToggleApproval(
                  params.row.id,
                  params.row.approved,
                  params.row.amount,
                  params.row.desc
                );
              }}
            />
          </div>
        );
      },
    },
  ];

  const handleToggleApproval = useCallback(
    (id: string, approved: boolean, amount: number, desc: string) => {
      if (currentUser?.role !== "ADMIN") {
        toast.error("Only admins can approve expenses.");
        return;
      }
      toast("Approving Expense. Please wait...");
      const emailData = {
        emailList: [
          "ojimmy@goldpayinvestment.com, niderima@goldpayinvestment.com",
        ],
        subject: `Expense Approval`,
        message: `Hello, <br/>Expense record for ${desc} at ${formatPrice(
          amount
        )} has been approved by admin.<br/> <br/>: <a target="_blank" href="https://goldpay-operations.vercel.app/dashboard/expenses/all/this-month">See all expenses this month</a><br/>
        <br/>Operator: ${currentUser?.firstname} ${
          currentUser?.lastname
        } <br/><br/><small>Goldpay Investment Operations App</small>`,
      };
      const transactionData = {
        // customerId: customer?.id,
        amount: amount,
        operator: `${currentUser?.firstname} ${currentUser?.lastname}`,
        type: "EXPENSEAPPROVAL",
      };

      axios
        .put("/api/approve-expense", {
          id,
          approved: true,
        })
        .then((res) => {
          axios
            .post("/api/send-email", emailData)
            .then(() => {
              toast.success("Email sent");
            })
            .catch((error) => {
              console.log(error);
            });

          axios
            .post("/api/create-transaction", transactionData)
            .then(() => {
              // toast.success("Transaction successfully created");
              // setIsTransactionCreated(true);
            })
            .catch((error) => {
              toast.error("Something went wrong when creating new transaction");
            });

          toast.success("Expense successfully approved");
          router.refresh();
        })
        .catch((error) => {
          toast.error("Something went wrong");
        });
    },
    []
  );

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

export default AllExpensesClient;
