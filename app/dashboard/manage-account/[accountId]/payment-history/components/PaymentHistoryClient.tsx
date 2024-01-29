"use client";

import React, { useCallback, useEffect } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { formatPrice } from "@/utils/formatPrice";
import { IoFlagOutline, IoFlagSharp } from "react-icons/io5";
import { MdEdit } from "react-icons/md";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import ActionBtn from "@/app/components/ActionBtn";
import { Customer, Loan, Payment } from "@prisma/client";
import moment from "moment";
import { SafeUser } from "@/types/user";
interface PaymentHistoryClientProps {
  payments: Payment[] | null;
  customer: Customer | null;
  currentUser: SafeUser | null;
}

const PaymentHistoryClient: React.FC<PaymentHistoryClientProps> = ({
  customer,
  currentUser,
  payments,
}) => {
  useEffect(() => {
    if (!currentUser) {
      router.push("/");
      router.refresh();
    }
  }, []);

  const router = useRouter();
  let rows: any = [];

  if (payments) {
    rows = payments.map((payment, idx) => {
      return {
        id: payment.id,
        count: idx + 1,
        amount: payment.amount,
        lateFee: payment?.lateFee,
        operator: payment.operator,
        notes: payment?.notes,
        interestRevenue: payment?.interestRevenue,
        createdAt: payment.createdAt,
        paymentDate: payment.actualPaymentDate,
        nextPaymentDate: payment.nextPaymentDate,
        flagged: payment?.flagged,
      };
    });
  }

  const columns: GridColDef[] = [
    {
      field: "count",
      headerName: "S/N",
      width: 30,
    },
    {
      field: "amount",
      headerName: "Amount",
      width: 130,
      renderCell: (params) => {
        return (
          <div className="0 text-center">{formatPrice(params.row.amount)}</div>
        );
      },
    },
    {
      field: "lateFee",
      headerName: "Late Fee",
      width: 130,
      renderCell: (params) => {
        return (
          <div className="0 text-center">{formatPrice(params.row.lateFee)}</div>
        );
      },
    },
    {
      field: "interestRevenue",
      headerName: "Interest Revenue",
      width: 130,
      renderCell: (params) => {
        return (
          <div className="0 text-center">
            {formatPrice(params.row.interestRevenue)}
          </div>
        );
      },
    },
    {
      field: "notes",
      headerName: "Notes",
      width: 210,
    },
    {
      field: "operator",
      headerName: "Operator",
      width: 100,
    },

    {
      field: "createdAt",
      headerName: "Recorded Date",
      width: 180,
      renderCell: (params) => {
        return (
          <div className="0 text-center">
            {moment(params.row.createdAt).format("MMMM D, YYYY h:mm a")}
          </div>
        );
      },
    },
    {
      field: "paymentDate",
      headerName: "Payment Date",
      width: 180,
      renderCell: (params) => {
        return (
          <div className="0 text-center">
            {moment(params.row.paymentDate).format("MMMM D, YYYY")}
          </div>
        );
      },
    },
    {
      field: "nextPaymentDate",
      headerName: "Next Payment Date",
      width: 180,
      renderCell: (params) => {
        return (
          <div className="0 text-center">
            {moment(params.row.nextPaymentDate).format("MMMM D, YYYY")}
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
            <ActionBtn
              icon={params.row.flagged ? IoFlagSharp : IoFlagOutline}
              onClick={() => {
                handleFlagPayment(params.row.id, params.row.flagged);
              }}
              filled={params.row.flagged}
            />
            <ActionBtn
              icon={MdEdit}
              onClick={() => {
                router.push(
                  `/dashboard/manage-account/${customer?.id}/payment-history/${params.row.id}/edit-payment`
                );
              }}
            />
          </div>
        );
      },
    },
  ];

  const handleFlagPayment = useCallback((id: string, flagged: boolean) => {
    toast("Changing payment flagged status. Please wait...");
    const emailData = {
      emailList: [
        "jini@goldpayinvestment.com, ojimmy@goldpayinvestment.com, niderima@goldpayinvestment.com",
      ],
      subject: `Payment Reconciliation`,
      message: `Hello, <br/>A payment error has been recorded for ${customer?.firstname} ${customer?.lastname} and needs your attention for correction. <br/> <br/> You can view the payment history for the customer here: <a target="_blank" href="https://goldpay-operations.vercel.app/dashboard/manage-account/${customer?.id}/payment-history">Loan Payment History for ${customer?.firstname} ${customer?.lastname}</a><br/>
      <br/>Operator: ${currentUser?.firstname} ${currentUser?.lastname} <br/><br/><small>Goldpay Investment Operations App</small>`,
    };

    axios
      .put("/api/flag-payment", {
        id,
        flagged: !flagged,
      })
      .then((res) => {
        toast.success("Payment Flagged Status Changed");
        router.refresh();
      })
      .catch((error) => {
        toast.error("Something went wrong while flagging this payment");
      });

    if (flagged === false) {
      axios
        .post("/api/send-email", emailData)
        .then(() => {
          toast.success("Email sent");
        })
        .catch((error) => {
          console.log(error);
          toast.error(
            "Something went wrong when approving customer registration"
          );
        });
    }

    // else {
    //   axios
    //     .post("/api/send-email", correctedEmailData)
    //     .then(() => {
    //       toast.success("Email sent");
    //     })
    //     .catch((error) => {
    //       console.log(error);
    //       toast.error(
    //         "Something went wrong when approving customer registration"
    //       );
    //     });
    // }
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

export default PaymentHistoryClient;
