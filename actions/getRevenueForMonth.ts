import prisma from "@/libs/prismadb";
import { startOfMonth, endOfMonth } from "date-fns";

export default async function getRevenueForMonth() {
  try {
    const currentDate = new Date();
    const startOfCurrentMonth = startOfMonth(currentDate);
    const endOfCurrentMonth = endOfMonth(currentDate);

    const loansForMonth = await prisma?.loan.findMany({
      where: {
        createdAt: {
          gte: startOfCurrentMonth,
          lte: endOfCurrentMonth,
        },
      },
    });

    const totalRevenueForMonth = loansForMonth.reduce(
      (sum, loan) =>
        sum +
        (loan.mgmtFee || 0) +
        (loan.advisoryFee || 0) +
        (loan.insuranceFee || 0) +
        (loan.lateFees || 0) +
        (loan.legalFee || 0),
      0
    );

    return {
      loansForMonth,
      totalRevenueForMonth,
    };
  } catch (error: any) {
    throw new Error(error);
  }
}
