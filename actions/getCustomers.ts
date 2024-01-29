import prisma from "@/libs/prismadb";

export default async function getCustomers(websiteReg: boolean) {
  try {
    const users = prisma?.customer.findMany({
      where: {
        websiteReg: websiteReg,
      },
    });
    return users;
  } catch (error: any) {
    throw new Error(error);
  }
}
