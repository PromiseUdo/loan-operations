"use client";

import React, { useState, useEffect, useCallback } from "react";
import "./stepper.css";
import clsx from "clsx";
import { TiTick } from "react-icons/ti";
import { FaInfoCircle } from "react-icons/fa";
import { FaSmile } from "react-icons/fa";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import toast from "react-hot-toast";
// import { SafeUser, UploadedImageType, ImageType } from "@/types";
// import SelectImage from "@/app/components/inputs/SelectImage";
// import firebaseApp from "@/libs/firebase";
import axios from "axios";
import { useRouter } from "next/navigation";
// import { signIn } from "next-auth/react";
import Heading from "@/app/components/Heading";
import Image from "next/image";
import SelectImage from "@/app/components/inputs/SelectImage";
import { ImageType, UploadedImageType } from "@/types/image";
import Button from "@/app/components/Button";
import { AiOutlineGoogle } from "react-icons/ai";
import Link from "next/link";
import firebaseApp from "@/libs/firebase";
import { signIn } from "next-auth/react";
import { LuAsterisk } from "react-icons/lu";

// interface StepperProps {
//   currentUser: SafeUser | null;
// }
let currentUser = false;
const RegisterForm = () => {
  const router = useRouter();
  const steps = ["Account Information", "Personal Details", "Complete"];
  const [photograph, setPhotograph] = useState<ImageType | null>();
  const [currentStep, setCurrentStep] = useState(1);
  const [complete, setComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passportImage, setPassportImage] = useState<ImageType | null>();
  const [isUserCreated, setIsUserCreated] = useState(false);
  const [message, setMessage] =
    useState<string>(` <p className="text-center text-black leading-relaxed ">
  Be Sure to Confirm your details before submitting
</p>
<p className="text-black leading-relaxed">
  Click <b>Finish</b> when you
  are ready to submit
</p>`);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      firstname: "",
      lastname: "",
      photograph: "",
      approved: false,
    },
  });

  useEffect(() => {
    setCustomValue("photograph", passportImage);
  }, [passportImage]);

  let image: ImageType | null = null;

  useEffect(() => {
    if (isUserCreated) {
      reset();
      setPassportImage(null);
      setIsUserCreated(false);
    }
  }, [isUserCreated]);

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    console.log("account data >>>>>", data);

    setIsLoading(true);
    let uploadedImage: UploadedImageType = "";

    const handleImageUploads = async () => {
      toast("Creating new account, please wait...");
      try {
        // for (const item of data.images) {
        if (data.photograph) {
          const fileName = new Date().getTime() + "-" + data.photograph.name;
          const storage = getStorage(firebaseApp);
          const storageRef = ref(storage, `profilephoto/${fileName}`);
          const uploadTask = uploadBytesResumable(storageRef, data.photograph);

          await new Promise<void>((resolve, reject) => {
            uploadTask.on(
              "state_changed",
              (snapshot) => {
                const progress =
                  (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log("Upload is " + progress + "% done");
                switch (snapshot.state) {
                  case "paused":
                    console.log("Upload is paused");
                    break;
                  case "running":
                    console.log("Upload is running");
                    break;
                }
              },
              (error) => {
                // Handle unsuccessful uploads
                console.log("Error uploading passport image", error);
                reject(error);
              },
              () => {
                getDownloadURL(uploadTask.snapshot.ref)
                  .then((downloadURL) => {
                    uploadedImage = downloadURL;

                    console.log("File available at", downloadURL);
                    resolve();
                  })
                  .catch((error) => {
                    console.log("error getting the download URL", error);
                    reject(error);
                  });
              }
            );
          });
        }
      } catch (error) {
        setIsLoading(false);
        console.log("Error handling image uploads", error);
        return toast.error("Error handling image uploads");
      }
    };

    await handleImageUploads();

    const userData = {
      ...data,
      photograph: uploadedImage,
      role: "ADMIN",
      approved: false,
    };

    console.log(userData);

    axios
      .post("/api/register", userData)
      .then(() => {
        toast.success("Account successfully created");
        setIsUserCreated(true);
        toast.success("A verification link has been sent to your email");
        setMessage("Kindly check your email for email verification link");
        // router.refresh();

        // signIn("credentials", {
        //   email: data.email,
        //   password: data.password,
        //   redirect: false,
        // }).then((callback) => {
        //   if (callback?.ok) {
        //     router.push("/dashboard");
        //     router.refresh();
        //     toast.success("Logged In");
        //   }
        //   if (callback?.error) {
        //     toast.error(callback.error);
        //   }
        // });
      })
      .catch((error) => {
        console.log(error);
        toast.error("Something went wrong when creating new account");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const addPassportPhotographToState = useCallback((value: ImageType) => {
    setPassportImage(value);
  }, []);

  const removePassportPhotographFromState = useCallback((value: ImageType) => {
    setPassportImage(null);
  }, []);

  if (currentUser) {
    return (
      <>
        <p className="text-center">Logged in. Redirecting...</p>
        <p className="text-xs text-black">
          If you are not being redirected, Click the button below to visit your
          dashboard
        </p>
        <button
          onClick={() => {
            router.push("/vendor/dashboard");
          }}
          className={clsx(
            "text-center rounded-md bg-orange-600 hover:bg-gray-700 text-gray-100 font-medium px-8 py-2"
          )}
        >
          Go to Dashboard
        </button>
      </>
    );
  }

  const registerOptions = {
    username: { required: "Username is required" },
    email: { required: "Email is required" },
    firstname: { required: "Firstname is required" },
    lastname: { required: "Lastname is required" },
    phone: { required: "Phone number is required" },
    password: {
      required: "Password is required",
      minLength: {
        value: 8,
        message: "Password must have at least 8 characters",
      },
    },
  };

  return (
    <>
      <div className="w-full flex flex-col items-center justify-center gap-3">
        <div className="relative w-20 h-20 aspect-square">
          <Image
            src="/defaultImage.png"
            alt="loanpay logo"
            className="object-contain cursor-pointer"
            onClick={() => router.push("/")}
            fill
          />
        </div>
        <Heading title="Sign up as Admin" center />
      </div>
      {/* <Button
        onClick={() => {}}
        outline
        label="Continue with Google"
        icon={AiOutlineGoogle}
      /> */}

      <hr className=" bg-slate-300 w-full h-px" />

      <div className="flex flex-col items-center">
        <div className="w-full flex justify-between ">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className={clsx(
                "step-item",
                currentStep === idx + 1 && "active",
                (idx + 1 < currentStep || complete || currentStep === 3) &&
                  "complete" //|| currentUser
              )}
            >
              <div className="text-black step">
                {idx + 1 < currentStep || complete ? ( //|| currentUser
                  <TiTick size={24} />
                ) : (
                  idx + 1
                )}
              </div>
              <p className="text-xs text-black whitespace-nowrap">{step}</p>
            </div>
          ))}
        </div>

        <div className="w-full py-4 content  min-h-fit">
          {currentStep === 1 && (
            <div className=" w-full ">
              <form className="flex flex-col gap-2">
                <div className="w-full">
                  <label className="flex items-center text-sm font-medium ">
                    <span> Username</span>
                    <LuAsterisk color="#D22B2B" />
                  </label>
                  <input
                    id="username"
                    disabled={isLoading}
                    {...register("username", { required: true })}
                    type="text"
                    name="username"
                    placeholder="Username"
                    className={clsx(
                      "w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary",
                      errors["username"]
                        ? "border-rose-400 focus:border-rose-400"
                        : "border-slate-300 focus:border-slate-300"
                    )}
                  />
                </div>

                <div className="w-full">
                  <label className="flex items-center text-sm font-medium ">
                    <span> Email</span>
                    <LuAsterisk color="#D22B2B" />
                  </label>
                  <input
                    id="email"
                    disabled={isLoading}
                    {...register("email", { required: true })}
                    name="email"
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
                  <label className="flex items-center text-sm font-medium ">
                    <span> Password</span>
                    <LuAsterisk color="#D22B2B" />
                  </label>
                  <input
                    id="password"
                    disabled={isLoading}
                    {...register("password", { required: true })}
                    type="password"
                    name="password"
                    placeholder="Password"
                    className={clsx(
                      "w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary",
                      errors["password"]
                        ? "border-rose-400 focus:border-rose-400"
                        : "border-slate-300 focus:border-slate-300"
                    )}
                  />
                </div>
              </form>
            </div>
          )}

          {currentStep === 2 && (
            <div className=" w-full ">
              <form className="flex flex-col gap-2">
                <div className="flex flex-col gap-1">
                  <label className="flex items-center text-sm font-medium ">
                    <span>Firstname</span>
                    <LuAsterisk color="#D22B2B" />{" "}
                  </label>
                  <input
                    id="firstname"
                    disabled={isLoading}
                    {...register("firstname", { required: true })}
                    type="text"
                    name="firstname"
                    placeholder="Firstname"
                    className={clsx(
                      "w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary",
                      errors["firstname"]
                        ? "border-rose-400 focus:border-rose-400"
                        : "border-slate-300 focus:border-slate-300"
                    )}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm flex items-center font-medium ">
                    <span> Lastname</span> <LuAsterisk color="#D22B2B" />
                  </label>

                  <input
                    id="lastname"
                    disabled={isLoading}
                    {...register("lastname", { required: true })}
                    type="text"
                    name="lastname"
                    placeholder="Lastname"
                    className={clsx(
                      "w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary",
                      errors["lastname"]
                        ? "border-rose-400 focus:border-rose-400"
                        : "border-slate-300 focus:border-slate-300"
                    )}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="flex items-center text-sm font-medium ">
                    <span> Phone</span>
                    <LuAsterisk color="#D22B2B" />
                  </label>

                  <input
                    id="phone"
                    disabled={isLoading}
                    {...register("phone", { required: true })}
                    type="text"
                    name="phone"
                    placeholder="Phone"
                    className={clsx(
                      "w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary",
                      errors["phone"]
                        ? "border-rose-400 focus:border-rose-400"
                        : "border-slate-300 focus:border-slate-300"
                    )}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex items-center">
                    <div className="block">
                      <SelectImage
                        item={null}
                        addImageToState={addPassportPhotographToState}
                        removeImageFromState={removePassportPhotographFromState}
                        isUserCreated={false}
                        label="Profile Photo"
                      />
                    </div>
                  </div>
                </div>
              </form>
            </div>
          )}

          {currentStep === 3 && !complete && !currentUser && (
            <div className=" w-full py-4 ">
              <div className="flex flex-col  items-center">
                <FaInfoCircle color="#f06105" />
                <div className="flex flex-col gap-1 w-full justify-center items-center">
                  <div dangerouslySetInnerHTML={{ __html: message }} />
                </div>
              </div>
            </div>
          )}

          {/* complete */}
          {complete && (
            <div className=" w-full py-4 ">
              <div className="flex flex-col  items-center">
                <FaSmile color="#f06105" size={40} />
                <div className="flex flex-col gap-1 w-full justify-center items-center">
                  <p className="text-center text-black leading-relaxed ">
                    Form Submitted Successfully!
                  </p>
                  <p className="text-center text-black leading-relaxed ">
                    Thank you for signing up
                    <p className="font-medium">
                      Kindly wait for account approval
                    </p>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {!currentUser ? (
          <div className="w-full flex justify-between py-8  items-center">
            {!isUserCreated && (
              <button
                onClick={() => {
                  setCurrentStep((prev) => prev - 1);
                }}
                className={clsx(
                  "text-center rounded-md bg-slate-500 text-[#f7f7f7] hover:bg-gray-700 text-gray-100 font-medium px-8 py-2",
                  (currentStep === 1 || complete) && "invisible"
                )}
              >
                Go Back
              </button>
            )}

            {!complete && currentStep < 3 && (
              <button
                onClick={() => {
                  currentStep === steps.length
                    ? setComplete(true)
                    : setCurrentStep((prev) => prev + 1);
                }}
                className="self-end text-center rounded-md text-[#f7f7f7] bg-graydark hover:bg-gray-700 text-gray-100 font-medium px-8 py-2"
              >
                {/* <span>{currentStep === steps.length ? "Finish" : "Next"}</span> */}
                <span>Next</span>
              </button>
            )}
            {!complete && currentStep === 3 && !isUserCreated && (
              <button
                onClick={handleSubmit(onSubmit)}
                className={clsx(
                  "text-center rounded-md bg-green-600 hover:bg-gray-700 text-[#f7f7f7] font-medium px-8 py-2",
                  isUserCreated && "invisible"
                )}
              >
                <span>
                  {isLoading && !currentUser ? "Loading..." : "Finish"}
                </span>
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="w-full flex justify-center py-8  items-center">
              <button
                onClick={() => {
                  router.push("/dashboard");
                }}
                className={clsx(
                  "text-center rounded-md bg-orange-600 hover:bg-gray-700 text-gray-100 font-medium px-8 py-2",
                  (currentStep === 1 || complete) && "invisible"
                )}
              >
                Go to Dashboard
              </button>
            </div>
          </>
        )}
        {/* <p className="text-sm text-center">
        Already have an account?{" "}
        <Link className="underline" href="/">
          Login
        </Link>
      </p> */}
      </div>
    </>
  );
};

export default RegisterForm;
