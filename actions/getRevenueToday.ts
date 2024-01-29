import prisma from "@/libs/prismadb";
import { startOfDay, endOfDay } from "date-fns";

export default async function getRevenueToday() {
  try {
    const currentDate = new Date();
    const startOfCurrentDate = startOfDay(currentDate);
    const endOfCurrentDate = endOfDay(currentDate);

    const loansToday = await prisma?.loan.findMany({
      where: {
        createdAt: {
          gte: startOfCurrentDate,
          lte: endOfCurrentDate,
        },
      },
    });

    const totalRevenueToday = loansToday.reduce(
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
      loansToday,
      totalRevenueToday,
    };
  } catch (error: any) {
    throw new Error(error);
  }
}
