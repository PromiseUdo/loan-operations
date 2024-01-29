// is-email-verified.ts
import prisma from "@/libs/prismadb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { email } = body;

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!existingUser) {
    return NextResponse.error();
  }

  if (existingUser.emailVerified === false) {
    return NextResponse.json(
      {
        message: "Email not verified",
      },
      {
        status: 400,
      }
    );
  }

  return NextResponse.json({ message: "ok" });
}
