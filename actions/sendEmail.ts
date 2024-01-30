import nodemailer from "nodemailer";

export async function sendMail(
  to: string | string[],
  subject: string,
  message: string
) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.APP_PASS,
    },
  });

  const mailOptions = {
    from: `Loanpay <${process.env.EMAIL}>`,
    to: Array.isArray(to) ? to.join(", ") : to,
    subject: subject,
    html: message,
  };

  try {
    const info = await transporter.sendMail({ ...mailOptions });
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}
