import prisma from "@/libs/prismadb";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/actions/getCurrentUser";

export async function PUT(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const body = await request.json();

  const { id, paid, lateFees, earnedRevenue, isOneOffPayment } = body;

  const existingLoan = await prisma.loan.findUnique({
    where: { id: id },
  });

  if (!existingLoan) {
    return NextResponse.error();
  }
  const existingEarnedRevenue = existingLoan.earnedRevenue || 0;
  const updatedEarnedRevenue =
    existingEarnedRevenue + parseFloat(earnedRevenue);

  const existingPaid = existingLoan.paid || 0; // Default to 0 if existingPaid is null
  const existingLateFee = existingLoan.lateFees || 0;
  const updatedPaid = existingPaid + parseFloat(paid);
  const updatedLateFees = existingLateFee + parseFloat(lateFees);
  const loan = await prisma.loan.update({
    where: { id: id },
    data: {
      paid: updatedPaid,
      paidPeriods: isOneOffPayment
        ? existingLoan.numberOfPeriods
        : (existingLoan?.paidPeriods || 0) + 1, // Increment paidPeriods by one
      lateFees: updatedLateFees,
      earnedRevenue: updatedEarnedRevenue,
    },
  });

  return NextResponse.json(loan);
}
