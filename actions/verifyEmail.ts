import prisma from "@/libs/prismadb";
import crypto from "crypto";
import { sendMail } from "./sendEmail";
export const resetPassword = async (email: string) => {
  console.log(email, "email resetting for");
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }
  const emailList = [`${email}`];
  const verifyEmailToken = crypto.randomBytes(32).toString("base64url");
  const today = new Date();
  const expiryDate = new Date(today.setDate(today.getDate() + 1));
  const message = `<h1>Verify email for <b>${email}</b>.</h1> <p>To verify your email, click on this link: <a href="http://localhost:3000/auth/verify-email?token=${verifyEmailToken}">Click here to verify your email</a></p>`;

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      emailVerificationToken: verifyEmailToken,
      resetPasswordExpiry: expiryDate,
    },
  });
  await sendMail(emailList, "Reset Password", message);
  return "Password reset email sent";
};
