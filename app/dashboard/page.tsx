import { getCurrentUser } from "@/actions/getCurrentUser";
import getCustomers from "@/actions/getCustomers";
import getLoans from "@/actions/getLoans";
import getPayments from "@/actions/getPayments";
import { SafeUser } from "@/types/user";
import React from "react";

const ECommerce = React.lazy(() => import("@/components/Dashboard/E-commerce"));

const page = async () => {
  const currentUser = await getCurrentUser();

  const websiteReg = false;

  const [loans, customers, payments] = await Promise.all([
    getLoans(),
    getCustomers(websiteReg),
    getPayments(),
  ]);

  const lateFees =
    payments?.reduce((total, payment) => total + (payment?.lateFee || 0), 0) ||
    0;

  const totalLoanAmount =
    loans?.reduce((total, loan) => total + (loan?.loanAmount || 0), 0) || 0;
  const totalInterestRevenue =
    loans?.reduce((total, loan) => total + (loan?.interestRevenue || 0), 0) ||
    0;

  let totalMgmtFee = 0;
  let totalAdvisoryFee = 0;
  let totalLegalFee = 0;
  let totalInsuranceFee = 0;

  // Calculate totals for each fee type for each loan
  loans?.forEach((loan) => {
    totalMgmtFee += loan?.mgmtFee || 0;
    totalAdvisoryFee += loan?.advisoryFee || 0;
    totalLegalFee += loan?.legalFee || 0;
    totalInsuranceFee += loan?.insuranceFee || 0;
  });

  // Calculate overall totals for all loans
  const overallTotals = {
    totalMgmtFee,
    totalAdvisoryFee,
    totalLegalFee,
    totalInsuranceFee,
  };

  // Calculate other charges (sum of all fees)
  const otherCharges =
    totalMgmtFee + totalAdvisoryFee + totalLegalFee + totalInsuranceFee;

  // Calculate the difference between unpaid and paid for each loan
  const differences = loans?.map((loan) => {
    const unpaid = loan.unpaid || 0;
    const paid = loan.paid || 0;
    return unpaid - paid;
  });

  // Sum the differences for all loans
  const totalDifference = differences.reduce(
    (total, difference) => total + difference,
    0
  );
  return (
    <>
      <ECommerce
        currentUser={currentUser}
        loans={loans ?? null}
        customers={customers?.length}
        totalLoanAmount={totalLoanAmount}
        totalInterestRevenue={totalInterestRevenue}
        otherCharges={otherCharges + lateFees}
        totalDifference={totalDifference}
      />
    </>
  );
};

export default page;
