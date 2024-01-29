import prisma from "@/libs/prismadb";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/actions/getCurrentUser";

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const body = await request.json();

  const { amount, otherCharges, customerId, type, operator } = body;
  const transaction = await prisma.transaction.create({
    data: {
      amount: parseFloat(amount),
      otherCharges: parseFloat(otherCharges),
      customerId,
      type,
      operator,
    },
  });

  return NextResponse.json(transaction);
}
