import prisma from "@/libs/prismadb";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/actions/getCurrentUser";

export async function PUT(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const body = await request.json();

  const {
    loanId,
    loanAmount,
    numberOfPeriods,
    interestRate,
    notes,
    mgmtFee,
    advisoryFee,
    legalFee,
    insuranceFee,
    monthlyPayment,
    interestRevenue,
  } = body;

  const loan = await prisma.loan.update({
    where: {
      id: loanId, // Specify the loanId for the where clause
    },
    data: {
      loanAmount: parseFloat(loanAmount),
      numberOfPeriods: parseInt(numberOfPeriods),
      interestRate: parseFloat(interestRate),
      notes,
      mgmtFee: parseFloat(mgmtFee),
      advisoryFee: parseFloat(advisoryFee),
      legalFee: parseFloat(legalFee),
      insuranceFee: parseFloat(insuranceFee),
      monthlyPayment: parseFloat(monthlyPayment),
      interestRevenue: parseFloat(interestRevenue),
    },
  });

  return NextResponse.json(loan);
}
