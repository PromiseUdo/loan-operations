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
import axios from "axios";

interface LoginFormProps {
  currentUser: SafeUser | null;
}

const LoginForm: React.FC<LoginFormProps> = ({ currentUser }) => {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [isVerified, setIsVerified] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
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

  useEffect(() => {
    if (currentUser) {
      router.push("/dashboard");
      router.refresh();
    }
  }, []);

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);

    const response = await axios
      .post("/api/is-email-verified", { email: data.email })
      .then(() => {
        signIn("credentials", {
          ...data,
          redirect: false,
        }).then((callback) => {
          setIsLoading(false);
          if (callback?.ok) {
            router.push("/dashboard");
            router.refresh();
            toast.success("Logged In. Redirecting to dashboard...");
          }
          if (callback?.error) {
            toast.error(callback.error);
          }
        });

        console.log("success");
        // router.refresh();
        setIsLoading(false);
      })
      .catch(async (error) => {
        setIsLoading(false);
        setIsVerified(false);
        setEmail(data.email);
        console.log(error, "error");
        toast.error(error.response.data.message);
      });

    console.log(data);
  };

  const handleVerifyEmail = async () => {
    const response = await axios
      .post("/api/request-verification", { email: email })
      .then(() => {
        console.log("success");
        toast.success("Check your email for a verification link");
        setMessage("Check your email for a verification link");
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error, "error");
        toast.error("Error sending email");
      });
  };

  if (currentUser) {
    return <p className="text-center">Logged in. Redirecting...</p>;
  }

  const signinOptions = {
    username: { required: "Username is required" },
    email: { required: "Email is required" },
    firstname: { required: "Firstname is required" },
    lastname: { required: "Lastname is required" },
    phone: { required: "Phone number is required" },
    password: {
      required: "Password is required",
    },
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center gap-6">
        <Image src="/images/logo.png" alt="logo" height={100} width={100} />
        <Heading title="Sign in for Goldpay" />
      </div>

      {/* <Button
        onClick={() => {}}
        outline
        label="Continue with Google"
        icon={AiOutlineGoogle}
      /> */}

      <hr className=" bg-slate-300 w-full h-px" />
      {isVerified ? (
        <>
          {" "}
          <div className="w-full">
            <label className="mb-3 block text-black dark:text-white">
              Email
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
          </div>
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
          <button
            disabled={isLoading}
            onClick={handleSubmit(onSubmit)}
            className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
          <p className="text-sm">
            <Link className="underline" href="/auth/reset-password">
              Forgot Password?
            </Link>
          </p>
          <p className="text-sm">
            Do not have an account?{" "}
            <Link className="underline" href="/register">
              Sign up
            </Link>
          </p>
        </>
      ) : message ? (
        <>
          <h1 className="font-semibold">{message}</h1>
        </>
      ) : (
        <button
          disabled={isLoading}
          onClick={() => handleVerifyEmail()}
          className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray"
        >
          {isLoading ? "Loading..." : "Click here to verify your email"}
        </button>
      )}
    </>
  );
};

export default LoginForm;
