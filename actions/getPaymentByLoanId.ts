import prisma from "@/libs/prismadb";

interface IParams {
  paymentId?: string;
}

export default async function getPaymentByLoanId(params: IParams) {
  try {
    const { paymentId } = params;
    const payment = await prisma.payment.findUnique({
      where: {
        id: paymentId,
      },
    });

    if (!payment) {
      return null;
    }

    return payment;
  } catch (error: any) {
    throw new Error(error);
  }
}
