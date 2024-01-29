import prisma from "@/libs/prismadb";

interface IParams {
  expenseId?: string;
}

export default async function getExpenseById(params: IParams) {
  try {
    const { expenseId } = params;
    const expense = await prisma.expense.findUnique({
      where: {
        id: expenseId,
      },
    });

    if (!expense) {
      return null;
    }

    return expense;
  } catch (error: any) {
    throw new Error(error);
  }
}
