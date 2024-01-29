import Container from "@/app/components/Container";
import React, { useEffect } from "react";
import FormWrap from "@/app/components/FormWrap";
import RegisterForm from "./components/RegisterForm";
import Carousel from "../components/Carousel";

const page = async () => {
  // const currentUser = await getCurrentUser();

  return (
    <main className=" h-[100vh]">
      <div className="w-full grid grid-cols-12">
        <div className="px-12 h-[100vh] w-full flex items-center justify-center bg-white col-span-12 lg:col-span-6">
          <div className=" mt-8 max-w-[fit-content] flex w-full flex-col gap-6 items-center  p-4 md:p-8">
            <RegisterForm />
          </div>
        </div>
        <div className="bg-black h-[100vh] col-span-6 hidden lg:block">
          <Carousel />
        </div>
      </div>
    </main>
  );
};

export default page;
