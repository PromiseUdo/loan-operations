"use client";

import React, { useState, useEffect } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Link from "next/link";
import { AiOutlineGoogle } from "react-icons/ai";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Heading from "@/app/components/Heading";
import Button from "@/app/components/Button";
import Image from "next/image";
import clsx from "clsx";
import { SafeUser } from "@/types/user";
import { resetPassword } from "@/actions/resetPassword";
import axios from "axios";

const ResetPasswordForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState<string>("");
  const [resetSent, setRequestSent] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);

    const emailData = {
      email: data.email,
    };
    const response = await axios
      .post("/api/reset-password", emailData)
      .then(() => {
        console.log("success");
        // router.refresh();
        toast.success("Password reset link sent to your email");
        setRequestSent(true);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error, "error");
        toast.error("Error sending email");
      });
    console.log(response, "tres");
  };

  return (
    <>
      <div className=" flex flex-col items-center justify-center gap-6">
        <Image src="/images/logo.png" alt="logo" height={100} width={100} />
        <Heading title="Reset Password Request" />
      </div>

      <hr className=" bg-slate-300 w-full h-px" />
      {!resetSent ? (
        <>
          <div className="w-full">
            <label className="mb-3 block text-black dark:text-white">
              Your Email
            </label>
            <input
              id="email"
              disabled={isLoading}
              {...register("email", { required: true })}
              name="email"
              required
              type="email"
              placeholder="Email"
              className={clsx(
                "w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary",
                errors["email"]
                  ? "border-rose-400 focus:border-rose-400"
                  : "border-slate-300 focus:border-slate-300"
              )}
            />
          </div>{" "}
          <button
            disabled={isLoading}
            onClick={handleSubmit(onSubmit)}
            className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray"
          >
            {isLoading ? "Please wait..." : "Reset Password"}
          </button>
        </>
      ) : (
        <div>
          {/* <Image
            className="mx-auto text-center"
            src="/success.svg"
            alt="logo"
            height={64}
            width={64}
          /> */}

          <p className="my-1 text-center text-xl font-medium">
            Reset password link has been sent to your email
          </p>
          {/* <p className="text-center">
            <Link href="/" className="text-primary hover:underline ">
              Click here to login
            </Link>{" "}
            with your new passowrd
          </p> */}
        </div>
      )}
    </>
  );
};

export default ResetPasswordForm;
