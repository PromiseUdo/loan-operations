import prisma from "@/libs/prismadb";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/actions/getCurrentUser";

export async function PUT(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== "ADMIN") {
    return NextResponse.error();
  }

  const body = await request.json();

  const { id, cleared } = body;

  // Retrieve the loan details
  const currentLoan = await prisma.loan.findUnique({
    where: { id: id },
  });

  if (!currentLoan) {
    return NextResponse.error();
  }

  // Calculate the unpaid amount
  const unpaidAmount = currentLoan.unpaid ?? 0;

  const loan = await prisma.loan.update({
    where: { id: id },
    data: {
      clearedStatus: cleared,
      dateCleared: new Date(),
      paid: unpaidAmount,
    },
  });

  return NextResponse.json(loan);
}
