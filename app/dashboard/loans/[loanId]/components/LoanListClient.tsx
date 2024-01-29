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
  currentUser: SafeUser | null;
}

const LoanListClient: React.FC<ApproveLoanClientProps> = ({
  loans,
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

export default LoanListClient;
