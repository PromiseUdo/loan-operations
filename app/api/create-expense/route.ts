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
    amount,
    desc,
    notes,
    chequeNo,
    operator,
    vendor,
    expenseReceipt,
    category,
  } = body;

  const expense = await prisma.expense.create({
    data: {
      amount: parseFloat(amount),
      desc,
      notes,
      chequeNo,
      operator,
      vendor,
      category,
      expenseReceipt,
    },
  });

  return NextResponse.json(expense);
}

export async function PUT(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== "ADMIN") {
    return NextResponse.error();
  }

  const body = await request.json();

  const { expenseId, amount, desc, notes, chequeNo, vendor, category } = body;

  const expense = await prisma.expense.update({
    where: { id: expenseId },
    data: {
      amount: parseFloat(amount),
      desc,
      notes,
      chequeNo,
      vendor,
      category,
    },
  });

  return NextResponse.json(expense);
}
