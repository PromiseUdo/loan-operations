import prisma from "@/libs/prismadb";
import { startOfMonth, endOfMonth } from "date-fns";

export default async function getExpensesForMonth(approved: boolean) {
  try {
    const currentDate = new Date();
    const startOfCurrentMonth = startOfMonth(currentDate);
    const endOfCurrentMonth = endOfMonth(currentDate);

    const expensesForMonth = await prisma?.expense.findMany({
      where: {
        approved: approved,
        createdAt: {
          gte: startOfCurrentMonth,
          lte: endOfCurrentMonth,
        },
      },
    });

    const totalAmountForMonth = expensesForMonth.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );

    return {
      expensesForMonth,
      totalAmountForMonth,
    };
  } catch (error: any) {
    throw new Error(error);
  }
}
