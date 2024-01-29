import { Customer } from "@prisma/client";

export type SafeCustomer = Omit<Customer, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};
