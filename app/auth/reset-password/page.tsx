import prisma from "@/libs/prismadb";

import { Metadata } from "next";
import ResetPasswordForm from "@/app/components/auth/ResetPasswordForm";
import FormWrap from "@/app/components/FormWrap";
import ChangePasswordForm from "@/app/components/auth/ChangePasswordForm";

export const metadata: Metadata = {
  title: "Loanpay Operations - Login",
  description: "This is the login page for Loanpay Operations application",
};

interface ResetPasswordPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function page({ searchParams }: ResetPasswordPageProps) {
  //   const currentUser = await getCurrentUser();
  if (searchParams.token) {
    const user = await prisma?.user.findFirst({
      where: {
        resetPasswordToken: searchParams.token as string,
      },
    });

    if (!user) {
      return <div>Invalid token</div>;
    }
    return (
      <div className="sm:w-1/2 mx-auto w-full">
        <FormWrap>
          <ChangePasswordForm
            resetPasswordToken={searchParams.token as string}
            userId={user.id}
          />
        </FormWrap>
      </div>
    );
  } else {
    return (
      <div className="sm:w-1/2 mx-auto w-full">
        <FormWrap>
          <ResetPasswordForm />
        </FormWrap>
      </div>
    );
  }
}
