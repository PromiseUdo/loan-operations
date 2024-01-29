import prisma from "@/libs/prismadb";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/actions/getCurrentUser";
import getLoanById from "@/actions/getLoanById";

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const body = await request.json();

  const {
    amount,
    lateFee,
    notes,
    loanId,
    operator,
    interestRevenue,
    nextPaymentDate,
    actualPaymentDate,
    customerId,
  } = body;

  const loan = getLoanById({ id: loanId });

  const paymentDate = new Date(actualPaymentDate);
  const paymentDateISO = paymentDate.toISOString();
  const nextPayDate = new Date(nextPaymentDate);
  const nextPayDateISO = nextPayDate.toISOString();

  // Set active to false for all payments belonging to the same customer and loan
  await prisma.payment.updateMany({
    where: {
      customerId,
      loanId,
    },
    data: {
      active: false,
    },
  });

  // Set active to true for the newly recorded payment
  const payment = await prisma.payment.create({
    data: {
      amount: parseFloat(amount),
      lateFee: parseInt(lateFee),
      notes,
      customerId,
      loanId,
      operator,
      nextPaymentDate: nextPayDateISO,
      actualPaymentDate: paymentDateISO,
      interestRevenue: parseFloat(interestRevenue),
      active: true,
    },
  });

  return NextResponse.json(payment);
}

export async function PUT(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const body = await request.json();

  const { paymentId, amount, lateFee, notes } = body;

  const payment = await prisma.payment.update({
    where: { id: paymentId },
    data: { amount: parseFloat(amount), lateFee: parseFloat(lateFee), notes },
  });

  return NextResponse.json(payment);
}
