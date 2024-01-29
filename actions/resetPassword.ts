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
  const resetPasswordToken = crypto.randomBytes(32).toString("base64url");
  const today = new Date();
  const expiryDate = new Date(today.setDate(today.getDate() + 1));
  const message = `<h1>Reset password for <b>${email}</b>.</h1> <p>To reset your password, click on this link and follow the instructions: <a href="https://goldpay-operations.vercel.app/auth/reset-password?token=${resetPasswordToken}">Click here to reset password</a></p>`;

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      resetPasswordToken: resetPasswordToken,
      resetPasswordExpiry: expiryDate,
    },
  });
  await sendMail(emailList, "Reset Password", message);
  return "Password reset email sent";
};
