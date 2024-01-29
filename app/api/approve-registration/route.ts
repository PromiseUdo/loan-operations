import prisma from "@/libs/prismadb";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/actions/getCurrentUser";

export async function PUT(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== "USER") {
    return NextResponse.error();
  }

  const body = await request.json();

  const { customerId, websiteReg } = body;

  const customer = await prisma.customer.update({
    where: { id: customerId },
    data: {
      websiteReg: websiteReg,
    },
  });

  return NextResponse.json(customer);
}
