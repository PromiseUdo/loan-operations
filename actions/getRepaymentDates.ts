// getRepaymentDates.ts

import prisma from "@/libs/prismadb";

export default async function getRepaymentDates() {
  try {
    const payments = await prisma?.payment.findMany({
      select: {
        nextPaymentDate: true,
        customerId: true, // Include the customerId
      },
      where: {
        active: true,
      },
    });

    // Convert repaymentDates to the desired format and include customerId
    const formattedDates = payments?.map((payment) => ({
      repaymentDate: payment.nextPaymentDate
        ? new Date(payment.nextPaymentDate).toISOString().split("T")[0]
        : null,
      customerId: payment.customerId,
    }));

    return formattedDates;
  } catch (error: any) {
    throw new Error(error);
  }
}
