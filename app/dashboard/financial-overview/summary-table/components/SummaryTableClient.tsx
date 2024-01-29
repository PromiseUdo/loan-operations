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

const SummaryTableClient: React.FC<AllExpensesClientProps> = ({
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
        month: item.date.month,
        year: item.date.year,
        category: item.category,
        amount: item.amount,
      };
    });
  }

  const columns: GridColDef[] = [
    {
      field: "count",
      headerName: "S/N",
      width: 100,
    },

    {
      field: "category",
      headerName: "Category",
      width: 250,
    },
    {
      field: "amount",
      headerName: "Total Amount",
      width: 250,
      renderCell: (params) => {
        return (
          <div className="0 text-center">{formatPrice(params.row.amount)}</div>
        );
      },
    },
    {
      field: "month",
      headerName: "Month",
      width: 150,
    },
    {
      field: "year",
      headerName: "Year",
      width: 150,
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

export default SummaryTableClient;
