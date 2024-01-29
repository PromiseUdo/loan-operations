import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Image from "next/image";

import { Metadata } from "next";
import FormWrap from "@/app/components/FormWrap";
import EditAccountForm from "./components/EditAccountForm";
import getCustomerById from "@/actions/getCustomerById";
export const metadata: Metadata = {
  title: "Profile Page | Next.js E-commerce Dashboard Template",
  description: "This is Profile page for TailAdmin Next.js",
  // other metadata
};

interface IParams {
  accountId?: string;
}

const NewCustomers = async ({ params }: { params: IParams }) => {
  const customer = await getCustomerById(params);

  return (
    <>
      <Breadcrumb pageName="Edit Account" />

      <EditAccountForm customer={customer ?? null} />
    </>
  );
};

export default NewCustomers;
