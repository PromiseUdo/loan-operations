import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

import { Metadata } from "next";
import getCustomers from "@/actions/getCustomers";
import { getCurrentUser } from "@/actions/getCurrentUser";
import getLoansByCustomerId from "@/actions/getLoansByCustomerId";
import getCustomerById from "@/actions/getCustomerById";
import EventLogsClient from "./components/EventLogsClient";
import getTransactionsByCustomerId from "@/actions/getTransactionsByCustomerId";
export const metadata: Metadata = {
  title: "Profile Page | Next.js E-commerce Dashboard Template",
  description: "This is Profile page for TailAdmin Next.js",
  // other metadata
};
interface IParams {
  accountId?: string;
}
const page = async ({ params }: { params: IParams }) => {
  const customers = await getCustomers();
  const currentUser = await getCurrentUser();
  const loans = await getLoansByCustomerId(params);
  const customer = await getCustomerById(params);
  const transactions = await getTransactionsByCustomerId(params);
  // if (!currentUser || currentUser.role !== "ADMIN") {
  //   return <NullData title="Oops!, Access denied" />;
  // }

  console.log(transactions, "<<<<<<<<<<<transactionss");
  return (
    <>
      <Breadcrumb
        pageName={`Event Logs - ${customer?.firstname} ${customer?.lastname}`}
      />

      <div className="overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
          <EventLogsClient
            loans={loans ?? null}
            customer={customer ?? null}
            currentUser={currentUser}
            transactions={transactions ?? null}
          />
        </div>
      </div>
    </>
  );
};

export default page;
