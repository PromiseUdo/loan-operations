import axios from "axios";
import * as schedule from "node-schedule";
import getRepaymentDates from "@/actions/getRepaymentDates";
import prisma from "@/libs/prismadb";

const getUpcomingRepaymentDates = async () => {
  const repaymentDates = await getRepaymentDates();

  const filteredRepaymentDates = repaymentDates.filter(
    (dateInfo) =>
      dateInfo.repaymentDate !== null &&
      new Date(dateInfo.repaymentDate) > new Date()
  );

  return filteredRepaymentDates;
};
getUpcomingRepaymentDates();

// Schedule job to send reminders
schedule.scheduleJob("0 25 11 * * *", async () => {
  const upcomingRepaymentDates = await getUpcomingRepaymentDates();

  upcomingRepaymentDates.forEach(async (dateInfo) => {
    const { repaymentDate, customerId } = dateInfo;

    if (repaymentDate) {
      const formattedDate = new Date(repaymentDate).toLocaleDateString();

      try {
        // Fetch the customer's phone number using customerId
        const customer = await prisma?.customer.findUnique({
          where: {
            id: customerId || undefined,
          },
          select: {
            phone: true,
          },
        });

        if (customer && customer.phone) {
          const message = `Friendly reminder: Your loan repayment is due on ${formattedDate}. Goldpay Investment`;

          await axios.post("https://api.ng.termii.com/api/sms/send", {
            to: `+234${customer.phone.substring(1)}`,
            from: "Goldpay",
            sms: message,
            type: "plain",
            api_key: process.env.TERMII_KEY,
            channel: "generic",
          });

          console.log("SMS Sent successfully.");
        }
      } catch (error) {
        console.error("Error fetching customer or sending SMS:", error);
      }
    }
  });
});
