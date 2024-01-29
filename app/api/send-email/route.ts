import { sendMail } from "@/actions/sendEmail";

import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  const { emailList, subject, message } = body;
  console.log(message, "email message");

  const email = await sendMail(emailList, subject, message);
  return NextResponse.json(email);
}
