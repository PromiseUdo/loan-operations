var bcrypt = require("bcrypt");
import { resetPassword } from "@/actions/resetPassword";
import prisma from "@/libs/prismadb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  const { email } = body;

  const message = await resetPassword(email);

  return NextResponse.json(message);
}
