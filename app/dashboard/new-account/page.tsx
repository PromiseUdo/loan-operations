import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Image from "next/image";

import { Metadata } from "next";
import NewAccountForm from "./components/NewAccountForm";
import FormWrap from "@/app/components/FormWrap";
import { getCurrentUser } from "@/actions/getCurrentUser";
export const metadata: Metadata = {
  title: "Loanpay - New account",
  description: "This is Profile page for TailAdmin Next.js",
  // other metadata
};

const NewCustomers = async () => {
  const currentUser = await getCurrentUser();

  return (
    <>
      <Breadcrumb pageName="Create Account" />
      <NewAccountForm currentUser={currentUser} />
    </>
  );
};

export default NewCustomers;
