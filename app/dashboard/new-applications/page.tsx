import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

import { Metadata } from "next";
import getCustomers from "@/actions/getCustomers";
import { getCurrentUser } from "@/actions/getCurrentUser";
import NewCustomersClient from "./components/NewCustomersClient";
export const metadata: Metadata = {
  title: "Profile Page | Next.js E-commerce Dashboard Template",
  description: "This is Profile page for TailAdmin Next.js",
  // other metadata
};

const page = async () => {
  const websiteReg = true;
  const customers = await getCustomers(websiteReg);
  const currentUser = await getCurrentUser();
  // if (!currentUser || currentUser.role !== "ADMIN") {
  //   return <NullData title="Oops!, Access denied" />;
  // }
  return (
    <>
      <Breadcrumb pageName="Website Applications" />

      <div className="overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
          <NewCustomersClient customers={customers} currentUser={currentUser} />
        </div>
      </div>
    </>
  );
};

export default page;
