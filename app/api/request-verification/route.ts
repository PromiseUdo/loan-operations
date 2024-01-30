import prisma from "@/libs/prismadb";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { sendMail } from "@/actions/sendEmail";

export async function POST(request: Request) {
  const body = await request.json();

  const { email } = body;

  console.log(email, "emaikl");

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  const emailVerificationToken = crypto.randomBytes(32).toString("base64url");
  const message = `<h1>Verify email for <b>${email}</b>.</h1> <p>To verify your email click on this link: <a href="https://loan-operations.vercel.app/auth/verify-email?token=${emailVerificationToken}">Click here to verify your email</a></p>`;
  await prisma.user.update({
    where: {
      id: user?.id,
    },
    data: {
      emailVerificationToken: emailVerificationToken,
    },
  });
  await sendMail([`${email}`], "Verifiy your email address", message);
  //   // return "Password reset email sent";

  return NextResponse.json(user);
}
