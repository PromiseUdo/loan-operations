import prisma from "@/libs/prismadb";

interface IParams {
  id?: string;
}
export default async function getPaymentHistoryByLoanId(params: IParams) {
  try {
    const { id } = params;

    const payments = prisma?.payment.findMany({
      where: {
        loanId: id,
      },
    });
    return payments;
  } catch (error: any) {
    throw new Error(error);
  }
}
