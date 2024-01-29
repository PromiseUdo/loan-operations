import prisma from "@/libs/prismadb";
import { startOfYear, endOfYear } from "date-fns";

export default async function getExpensesForYear(approved: boolean) {
  try {
    const currentDate = new Date();
    const startOfCurrentYear = startOfYear(currentDate);
    const endOfCurrentYear = endOfYear(currentDate);

    const expensesForYear = await prisma?.expense.findMany({
      where: {
        approved: approved,
        createdAt: {
          gte: startOfCurrentYear,
          lte: endOfCurrentYear,
        },
      },
    });

    const totalAmountForYear = expensesForYear.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );

    return {
      expensesForYear,
      totalAmountForYear,
    };
  } catch (error: any) {
    throw new Error(error);
  }
}
