import prisma from "@/libs/prismadb";

export default async function getExpenses(approved: boolean) {
  try {
    const expenses = prisma?.expense.findMany({
      where: {
        approved: approved,
      },
    });
    return expenses;
  } catch (error: any) {
    throw new Error(error);
  }
}
