import prisma from "@/libs/prismadb";

interface IParams {
  accountId?: string;
}
export default async function getTransactionsByCustomerId(params: IParams) {
  try {
    const { accountId } = params;

    const transactions = prisma?.transaction.findMany({
      where: {
        customerId: accountId,
      },
    });
    return transactions;
  } catch (error: any) {
    throw new Error(error);
  }
}
