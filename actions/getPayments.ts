import prisma from "@/libs/prismadb";

export default async function getPayments() {
  try {
    const users = prisma?.payment.findMany({});
    return users;
  } catch (error: any) {
    throw new Error(error);
  }
}
