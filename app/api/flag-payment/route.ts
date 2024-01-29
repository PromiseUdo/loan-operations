import prisma from "@/libs/prismadb";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/actions/getCurrentUser";

export async function PUT(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const body = await request.json();

  const { id, flagged } = body;

  const payment = await prisma.payment.update({
    where: { id: id },
    data: { flagged: flagged },
  });

  return NextResponse.json(payment);
}
