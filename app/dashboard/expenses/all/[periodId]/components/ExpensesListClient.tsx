"use client";

import React, { useCallback, useEffect } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { formatPrice } from "@/utils/formatPrice";
import Heading from "@/app/components/Heading";
import { MdEditNote, MdRemoveRedEye } from "react-icons/md";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import ActionBtn from "@/app/components/ActionBtn";
import { Customer, Expense } from "@prisma/client";
import { SafeUser } from "@/types/user";
import moment from "moment";
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
      field: "action",
      headerName: "Actions",
      width: 100,
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
          </div>
        );
      },
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
  ];

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
