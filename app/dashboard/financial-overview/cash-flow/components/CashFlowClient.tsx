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
  cashFlow: any;
}

const CashFlowClient: React.FC<AllExpensesClientProps> = ({
  currentUser,
  cashFlow,
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

  if (cashFlow) {
    rows = cashFlow.map((item: any, idx: number) => {
      return {
        id: item.id,
        count: idx + 1,
        date: item.date,
        category: item.category,
        amount: item.amount,
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
      field: "createdAt",
      headerName: "Created On",
      width: 120,
      renderCell: (params) => {
        return (
          <div className="0 text-center">
            {moment(params.row.date).format("MMMM D, YYYY h:mm a")}
          </div>
        );
      },
    },
    {
      field: "category",
      headerName: "Category",
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

export default CashFlowClient;
