import prisma from "@/libs/prismadb";
import { startOfDay, endOfDay } from "date-fns";

export default async function getExpensesToday(approved: boolean) {
  try {
    const currentDate = new Date();
    const startOfCurrentDate = startOfDay(currentDate);
    const endOfCurrentDate = endOfDay(currentDate);

    const expensesToday = await prisma?.expense.findMany({
      where: {
        approved: approved,
        createdAt: {
          gte: startOfCurrentDate,
          lte: endOfCurrentDate,
        },
      },
    });

    const totalAmountToday = expensesToday.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );

    return {
      expensesToday,
      totalAmountToday,
    };
  } catch (error: any) {
    throw new Error(error);
  }
}
