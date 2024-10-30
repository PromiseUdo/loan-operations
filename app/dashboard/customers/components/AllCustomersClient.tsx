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
import { Customer, Loan } from "@prisma/client";
import { SafeUser } from "@/types/user";
interface AllCustomersClientProps {
  customers: Customer[];
  currentUser: SafeUser | null;
  loans: Loan[] | null;
}

const AllCustomersClient: React.FC<AllCustomersClientProps> = ({
  customers,
  currentUser,
  loans,
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

  if (customers) {
    rows = customers.map((customer) => {
      const customerLoan = loans
        ? loans.find((loan) => loan.customerId === customer.id)
        : null;
      return {
        id: customer.id,
        firstname: customer.firstname,
        lastname: customer.lastname,
        gender: customer.gender,
        email: customer.email,
        phone: customer.phone,
        nin: customer.nin,
        alternatePhone: customer.alternatePhone,
        nextOfKin: customer.nextOfKin,
        nextOfKinPhone: customer.nextOfKinPhone,
        businessName: customer.businessName,
        businessPhone: customer.businessPhone,
        netMonthlyIncome: customer.netMonthlyIncome,
        purposeOfLoan: customer.purposeOfLoan,
        loanAmount: customer.desiredLoanAmount,
        unpaid: customerLoan?.unpaid || 0,
        paid: customerLoan?.paid || 0,
        balance: (customerLoan?.unpaid || 0) - (customerLoan?.paid || 0),
      };
    });
  }

  const columns: GridColDef[] = [
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
                  `/dashboard/manage-account/${params.row.id}/edit-account`
                );
              }}
            />
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
      field: "nin",
      headerName: "NIN",
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
      field: "unpaid",
      headerName: "Current Loan Amount",
      width: 170,
      renderCell: (params) => {
        return (
          <div className="0 text-center">{formatPrice(params.row.unpaid)}</div>
        );
      },
    },
    {
      field: "paid",
      headerName: "Amount Paid",
      width: 170,
      renderCell: (params) => {
        return (
          <div className="0 text-center">{formatPrice(params.row.paid)}</div>
        );
      },
    },
    {
      field: "balance",
      headerName: "Unpaid Bal",
      width: 170,
      renderCell: (params) => {
        return (
          <div className="0 text-center">{formatPrice(params.row.balance)}</div>
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

export default AllCustomersClient;
