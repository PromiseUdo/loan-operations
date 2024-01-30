import { Metadata } from "next";
import FormWrap from "./components/FormWrap";
import LoginForm from "./components/auth/LoginForm";
import Carousel from "./components/Carousel";
import { getCurrentUser } from "@/actions/getCurrentUser";
import getRepaymentDates from "@/actions/getRepaymentDates";

export const metadata: Metadata = {
  title: "Loanpay Operations - Login",
  description: "This is the login page for Loanpay Operations application",
};

export default async function Home() {
  const currentUser = await getCurrentUser();

  return (
    <main className="">
      <div className="w-full  grid grid-cols-12">
        <div className="px-12  bg-white h-screen w-full col-span-12 lg:col-span-5 ">
          <FormWrap>
            <LoginForm currentUser={currentUser} />
          </FormWrap>
        </div>
        <div className="bg-black h-screen col-span-7 hidden lg:block">
          <Carousel />
        </div>
      </div>
    </main>
  );
}
