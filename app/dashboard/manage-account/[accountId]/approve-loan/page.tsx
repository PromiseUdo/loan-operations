import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

import { Metadata } from "next";
import getCustomers from "@/actions/getCustomers";
import { getCurrentUser } from "@/actions/getCurrentUser";
import ApproveLoanClient from "./components/ApproveLoanClient";
import getLoansByCustomerId from "@/actions/getLoansByCustomerId";
import getCustomerById from "@/actions/getCustomerById";
export const metadata: Metadata = {
  title: "Profile Page | Next.js E-commerce Dashboard Template",
  description: "This is Profile page for TailAdmin Next.js",
  // other metadata
};
interface IParams {
  accountId?: string;
}
const page = async ({ params }: { params: IParams }) => {
  const websiteReg = false;

  const customers = await getCustomers(websiteReg);
  const currentUser = await getCurrentUser();
  const loans = await getLoansByCustomerId(params);
  const customer = await getCustomerById(params);
  // if (!currentUser || currentUser.role !== "ADMIN") {
  //   return <NullData title="Oops!, Access denied" />;
  // }
  return (
    <>
      <Breadcrumb
        pageName={`Loans - ${customer?.firstname} ${customer?.lastname}`}
      />

      <div className="overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
          <ApproveLoanClient
            loans={loans ?? null}
            customer={customer ?? null}
            currentUser={currentUser}
          />
        </div>
      </div>
    </>
  );
};

export default page;
