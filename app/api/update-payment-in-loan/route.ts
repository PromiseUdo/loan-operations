import prisma from "@/libs/prismadb";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/actions/getCurrentUser";

export async function PUT(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const body = await request.json();

  const { id, paid } = body;
  //   const existingLoan = await prisma.loan.findUnique({
  //     where: { id: id },
  //   });

  //   if (!existingLoan) {
  //     return NextResponse.error();
  //   }

  //   const existingPaid = existingLoan.paid || 0; // Default to 0 if existingPaid is null
  //   const updatedPaid = existingPaid + parseFloat(paid);

  const loan = await prisma.loan.update({
    where: { id: id },
    data: {
      paid: parseFloat(paid),
    },
  });

  return NextResponse.json(loan);
}
