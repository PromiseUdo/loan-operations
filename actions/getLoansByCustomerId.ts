import prisma from "@/libs/prismadb";

interface IParams {
  accountId?: string;
}
export default async function getLoansByCustomerId(params: IParams) {
  try {
    const { accountId } = params;

    const users = prisma?.loan.findMany({
      where: {
        customerId: accountId,
      },
    });
    return users;
  } catch (error: any) {
    throw new Error(error);
  }
}
