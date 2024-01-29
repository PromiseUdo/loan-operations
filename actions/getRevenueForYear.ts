import prisma from "@/libs/prismadb";
import { startOfYear, endOfYear } from "date-fns";

export default async function getRevenueForYear() {
  try {
    const currentDate = new Date();
    const startOfCurrentYear = startOfYear(currentDate);
    const endOfCurrentYear = endOfYear(currentDate);

    const loansForYear = await prisma?.loan.findMany({
      where: {
        createdAt: {
          gte: startOfCurrentYear,
          lte: endOfCurrentYear,
        },
      },
    });

    const totalRevenueForYear = loansForYear.reduce(
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
      loansForYear,
      totalRevenueForYear,
    };
  } catch (error: any) {
    throw new Error(error);
  }
}
