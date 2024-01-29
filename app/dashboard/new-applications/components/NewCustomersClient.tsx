"use client";

import React, { useCallback, useEffect } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { formatPrice } from "@/utils/formatPrice";
import Heading from "@/app/components/Heading";
import {
  MdCached,
  MdClose,
  MdDelete,
  MdDone,
  MdEditNote,
  MdRemoveRedEye,
} from "react-icons/md";
import { useRouter } from "next/navigation";
// import { deleteObject, getStorage, ref } from "firebase/storage";
// import firebaseApp from "@/libs/firebase";
import Status from "@/app/components/Status";
import ActionBtn from "@/app/components/ActionBtn";
import { Customer } from "@prisma/client";
import { SafeUser } from "@/types/user";
interface AllCustomersClientProps {
  customers: Customer[];
  currentUser: SafeUser | null;
}

const NewCustomersClient: React.FC<AllCustomersClientProps> = ({
  customers,
  currentUser,
}) => {
  const router = useRouter();
  //   const storage = getStorage(firebaseApp);
  let rows: any = [];

  useEffect(() => {
    if (!currentUser) {
      router.push("/");
      router.refresh();
    }
  }, []);

  if (customers) {
    rows = customers.map((customer) => {
      return {
        id: customer.id,
        firstname: customer.firstname,
        lastname: customer.lastname,
        gender: customer.gender,
        email: customer.email,
        phone: customer.phone,
        alternatePhone: customer.alternatePhone,
        nextOfKin: customer.nextOfKin,
        nextOfKinPhone: customer.nextOfKinPhone,
        businessName: customer.businessName,
        businessPhone: customer.businessPhone,
        netMonthlyIncome: customer.netMonthlyIncome,
        purposeOfLoan: customer.purposeOfLoan,
        loanAmount: customer.desiredLoanAmount,
      };
    });
  }

  const columns: GridColDef[] = [
    {
      field: "firstname",
      headerName: "First Name",
      width: 150,
    },
    {
      field: "lastname",
      headerName: "Last Name",
      width: 150,
    },
    {
      field: "gender",
      headerName: "Gender",
      width: 80,
    },
    {
      field: "email",
      headerName: "Email",
      width: 220,
    },
    {
      field: "phone",
      headerName: "Phone",
      width: 120,
    },
    {
      field: "alternatePhone",
      headerName: "Alternate Phone",
      width: 120,
    },
    {
      field: "nextOfKin",
      headerName: "Next of Kin",
      width: 150,
    },
    {
      field: "nextOfKinPhone",
      headerName: "Phone (NOF)",
      width: 120,
    },
    {
      field: "businessName",
      headerName: "Business Name",
      width: 170,
    },
    {
      field: "businessPhone",
      headerName: "Business Phone",
      width: 120,
    },
    {
      field: "netMonthlyIncome",
      headerName: "Net Monthly Income",
      width: 170,
      renderCell: (params) => {
        return (
          <div className="0 text-center">
            {formatPrice(params.row.netMonthlyIncome)}
          </div>
        );
      },
    },
    {
      field: "purposeOfLoan",
      headerName: "Purpose Of Loan",
      width: 170,
    },
    {
      field: "loanAmount",
      headerName: "Desired Loan Amount",
      width: 170,
      renderCell: (params) => {
        return (
          <div className="0 text-center">
            {formatPrice(params.row.loanAmount)}
          </div>
        );
      },
    },

    {
      field: "action",
      headerName: "Actions",
      width: 80,
      renderCell: (params) => {
        return (
          <div className="flex justify-between gap-4 w-full">
            <ActionBtn
              icon={MdRemoveRedEye}
              onClick={() => {
                router.push(`/dashboard/manage-account/${params.row.id}`);
              }}
            />
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

export default NewCustomersClient;
