var bcrypt = require("bcrypt");
import { changePassword } from "@/actions/changePassword";
import { resetPassword } from "@/actions/resetPassword";
import prisma from "@/libs/prismadb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  const { resetPasswordToken, password, userId } = body;

  const message = await changePassword(resetPasswordToken, password, userId);

  return NextResponse.json(message);
}
