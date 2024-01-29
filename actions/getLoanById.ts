import prisma from "@/libs/prismadb";

interface IParams {
  id?: string;
}

export default async function getLoanById(params: IParams) {
  try {
    const { id } = params;
    const loan = await prisma.loan.findUnique({
      where: {
        id: id,
      },
    });

    if (!loan) {
      return null;
    }

    return loan;
  } catch (error: any) {
    throw new Error(error);
  }
}
