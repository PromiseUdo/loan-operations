import prisma from "@/libs/prismadb";

interface IParams {
  accountId?: string;
}

export default async function getCustomerById(params: IParams) {
  try {
    const { accountId } = params;
    const customer = await prisma.customer.findUnique({
      where: {
        id: accountId,
      },
    });

    if (!customer) {
      return null;
    }

    return customer;
  } catch (error: any) {
    throw new Error(error);
  }
}
