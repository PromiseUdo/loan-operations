import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

import { Metadata } from "next";
import AllCustomersClient from "./components/AllCustomersClient";
import getCustomers from "@/actions/getCustomers";
import { getCurrentUser } from "@/actions/getCurrentUser";
import getPayments from "@/actions/getPayments";
import getLoans from "@/actions/getLoans";
export const metadata: Metadata = {
  title: "Loanpay Operations - Customers",
  description: "All customers page",
  // other metadata
};

const NewCustomers = async () => {
  const websiteReg = false;
  const customers = await getCustomers(websiteReg);
  const currentUser = await getCurrentUser();
  const payments = await getPayments();
  const clearedStatus = false;
  const loans = await getLoans({ clearedStatus: false });

  return (
    <>
      <Breadcrumb pageName="Customers" />

      <div className="overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
          <AllCustomersClient
            loans={loans ?? null}
            customers={customers}
            currentUser={currentUser}
          />
        </div>
      </div>
    </>
  );
};

export default NewCustomers;
