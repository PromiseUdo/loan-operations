import prisma from "@/libs/prismadb";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/actions/getCurrentUser";

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const body = await request.json();

  const {
    loanAmount,
    numberOfPeriods,
    interestRate,
    repaymentPlan,
    notes,
    approvalStatus,
    customerId,
    mgmtFee,
    advisoryFee,
    legalFee,
    insuranceFee,
    monthlyPayment,
    unpaid,
    interestRevenue,
    paidPeriods,
    paid,
    clearedStatus,
    createdAt,
  } = body;

  const createdAtDate = new Date(createdAt);
  const createdAtISO = createdAtDate.toISOString();

  const loan = await prisma.loan.create({
    data: {
      loanAmount: parseFloat(loanAmount),
      numberOfPeriods: parseInt(numberOfPeriods),
      interestRate: parseFloat(interestRate),
      repaymentPlan,
      notes,
      approvalStatus,
      paidPeriods,
      customerId,
      mgmtFee: parseFloat(mgmtFee),
      advisoryFee: parseFloat(advisoryFee),
      legalFee: parseFloat(legalFee),
      insuranceFee: parseFloat(insuranceFee),
      monthlyPayment: parseFloat(monthlyPayment),
      unpaid: parseFloat(unpaid),
      interestRevenue: parseFloat(interestRevenue),
      paid,
      clearedStatus,
      createdAt: createdAtISO,
    },
  });

  return NextResponse.json(loan);
}

export async function PUT(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== "ADMIN") {
    return NextResponse.error();
  }

  const body = await request.json();

  const { id, approved } = body;

  const loan = await prisma.loan.update({
    where: { id: id },
    data: { approvalStatus: approved, dateApproved: new Date() },
  });

  return NextResponse.json(loan);
}
