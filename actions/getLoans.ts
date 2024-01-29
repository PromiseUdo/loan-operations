import prisma from "@/libs/prismadb";

interface IParams {
  clearedStatus?: boolean;
}

export default async function getLoans(params?: IParams) {
  try {
    const { clearedStatus } = params || {};

    const loans = await prisma?.loan.findMany({
      where: {
        clearedStatus: clearedStatus !== undefined ? clearedStatus : undefined,
      },
    });

    return loans;
  } catch (error: any) {
    throw new Error(error);
  }
}
