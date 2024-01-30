import prisma from "@/libs/prismadb";
import { Metadata } from "next";
import ResetPasswordForm from "@/app/components/auth/ResetPasswordForm";
import FormWrap from "@/app/components/FormWrap";
import ChangePasswordForm from "@/app/components/auth/ChangePasswordForm";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Loanpay Operations - Login",
  description: "This is the login page for Loanpay Operations application",
};

interface VerifyEmailPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function page({ searchParams }: VerifyEmailPageProps) {
  //   const currentUser = await getCurrentUser();
  if (searchParams.token) {
    const user = await prisma?.user.findFirst({
      where: {
        emailVerificationToken: searchParams.token as string,
      },
    });

    if (!user) {
      return <div>Invalid token</div>;
    }

    await prisma?.user.update({
      where: {
        id: user.id,
      },
      data: {
        emailVerified: true,
        emailVerificationToken: null,
      },
    });
    return (
      <FormWrap>
        <div className=" w-full  flex-col items-center flex gap-4 justify-center  ">
          <Image src="/images/logo.png" alt="logo" height={100} width={100} />
          <hr className=" bg-slate-300 w-64 h-px" />
          <Image src="/success.svg" alt="logo" height={64} width={64} />

          <h1 className="text-xl md:text-2xl leading-relaxed font-medium max-w-lg text-center">
            Email Verified for <b>{user.email}</b>!
          </h1>
          <Link
            href="/"
            className="rounded bg-primary p-3 font-medium text-gray"
          >
            Click here to login
          </Link>
        </div>
      </FormWrap>
    );
  } else {
    return (
      <div className="sm:w-1/2 mx-auto w-full">
        <h1>Verify Email</h1>
        No email verification found. Check your email
      </div>
    );
  }
}
