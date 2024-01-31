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
import { changePassword } from "@/actions/changePassword";

interface ChangePasswordFormProps {
  resetPasswordToken: string;
  userId: string;
}

const ResetPasswordForm = ({
  resetPasswordToken,
  userId,
}: ChangePasswordFormProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [passwordChanged, setPasswordChanged] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);

    if (data.password !== data.confirmPassword) {
      setMessage("Passwords do not match");
      setIsLoading(false);

      return;
    }

    const changePasswordData = {
      resetPasswordToken: resetPasswordToken,
      password: data.password,
      userId: userId,
    };

    const response = await axios
      .post("/api/change-password", changePasswordData)
      .then(() => {
        console.log("success");
        // router.refresh();
        toast.success("Password changed successfully");
        setPasswordChanged(true);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error, "error");
        toast.error("Error sending request");
      });
    console.log(response);
    // setMessage(message);
  };

  return (
    <>
      <div className=" flex flex-col items-center justify-center gap-6">
        <Image src="/defaultImage.png" alt="logo" height={100} width={100} />
        <Heading title="Change Password" />
      </div>

      {/* <Button
        onClick={() => {}}
        outline
        label="Continue with Google"
        icon={AiOutlineGoogle}
      /> */}

      <hr className=" bg-slate-300 w-full h-px" />
      {!passwordChanged ? (
        <>
          {" "}
          <div className="w-full">
            <label className="mb-3 block text-black dark:text-white">
              Password
            </label>
            <input
              id="password"
              disabled={isLoading}
              {...register("password", { required: true })}
              name="password"
              required
              type="password"
              placeholder="Password"
              className={clsx(
                "w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary",
                errors["password"]
                  ? "border-rose-400 focus:border-rose-400"
                  : "border-slate-300 focus:border-slate-300"
              )}
            />
          </div>
          <div className="w-full">
            <label className="mb-3 block text-black dark:text-white">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              disabled={isLoading}
              {...register("confirmPassword", { required: true })}
              name="confirmPassword"
              required
              type="confirmPassword"
              placeholder="Confirm Password"
              className={clsx(
                "w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary",
                errors["confirmPassword"]
                  ? "border-rose-400 focus:border-rose-400"
                  : "border-slate-300 focus:border-slate-300"
              )}
            />
          </div>
          <button
            disabled={isLoading}
            onClick={handleSubmit(onSubmit)}
            className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray"
          >
            {isLoading ? "Please wait..." : "Reset Password"}
          </button>
        </>
      ) : (
        <>
          {" "}
          <div>
            <Image
              className="mx-auto text-center"
              src="/success.svg"
              alt="logo"
              height={64}
              width={64}
            />

            <p className="my-1 text-center text-xl font-medium">
              Password has been reset successfully
            </p>
            <p className="text-center">
              <Link href="/" className="text-primary hover:underline ">
                Click here to login
              </Link>{" "}
              with your new passowrd
            </p>
          </div>
        </>
      )}

      {/* <p className="text-sm">
        Do not have an account?{" "}
        <Link className="underline" href="/register">
          Sign up
        </Link>
      </p> */}
    </>
  );
};

export default ResetPasswordForm;
