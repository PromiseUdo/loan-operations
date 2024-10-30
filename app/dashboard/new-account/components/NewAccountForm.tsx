"use client";

import SelectImage from "@/app/components/inputs/SelectImage";
import { ImageType, UploadedImageType } from "@/types/image";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import firebaseApp from "@/libs/firebase";
import { LuAsterisk } from "react-icons/lu";
import Select from "react-select";
import geoData from "../../geoData.json";

import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import {
  FieldValues,
  SubmitHandler,
  Controller,
  useForm,
} from "react-hook-form";
import toast from "react-hot-toast";
import axios from "axios";
import { signIn } from "next-auth/react";
import clsx from "clsx";
import { Customer } from "@prisma/client";
import { SafeUser } from "@/types/user";

enum GenderEnum {
  female = "female",
  male = "male",
  other = "other",
}

interface Gender {
  gender: GenderEnum;
}

interface NewAccountFormProps {
  currentUser: SafeUser | null;
}

const NewAccountForm: React.FC<NewAccountFormProps> = ({ currentUser }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formType, setFormType] = useState("personal");
  const [isCustomerCreated, setIsCustomerCreated] = useState(false);
  const [addBusinessInfo, setAddBusinessInfo] = useState(false);
  const [cacDocument, setCacDocument] = useState<ImageType | null>();
  const [customerIdentificationImage, setCustomerIdentificationImage] =
    useState<ImageType | null>();
  const [proofOfResidenceImage, setProofOfResidenceImage] =
    useState<ImageType | null>();
  const [guarantorPassportImage2, setGuarantorPassportImage2] =
    useState<ImageType | null>();
  const [guarantorPassportImage1, setGuarantorPassportImage1] =
    useState<ImageType | null>();
  const [customerPassportImage, setCustomerPassportImage] =
    useState<ImageType | null>();

  const router = useRouter();

  useEffect(() => {
    if (!currentUser) {
      router.push("/");
      router.refresh();
    }
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      phone: "",
      alternatePhone: "",
      gender: "",
      nin:"",
      maritalStatus: "",
      howYouHeard: "",
      dateOfBirth: "",
      nextOfKin: "",
      nextOfKinPhone: "",
      country: "",
      state: "",
      lga: "",
      address: "",
      netMonthlyIncome: "",
      purposeOfLoan: "",
      desiredLoanAmount: "",
      customerPassport: "",
      guarantorName1: "",
      guarantorPhone1: "",
      guarantorPassport1: "",
      guarantorName2: "",
      guarantorPhone2: "",
      guarantorPassport2: "",
      customerIdentification: "",
      proofOfResidence: "",
      comments: "",
      businessName: "",
      businessType: "",
      businessPhone: "",
      businessAddress: "",
      businessEmail: "",
      cacNumber: "",
      cacDocument: "",
    },
  });

  const selectedCountry = watch("country");
  const selectedState = watch("state");

  useEffect(() => {
    setCustomValue("guarantorPassport1", guarantorPassportImage1);
  }, [guarantorPassportImage1]);

  useEffect(() => {
    setCustomValue("guarantorPassport2", guarantorPassportImage2);
  }, [guarantorPassportImage2]);
  useEffect(() => {
    setCustomValue("customerPassport", customerPassportImage);
  }, [customerPassportImage]);

  useEffect(() => {
    setCustomValue("cacDocument", cacDocument);
  }, [cacDocument]);
  useEffect(() => {
    setCustomValue("customerIdentification", customerIdentificationImage);
  }, [customerIdentificationImage]);
  useEffect(() => {
    setCustomValue("proofOfResidence", proofOfResidenceImage);
  }, [proofOfResidenceImage]);

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);
    let uploadedCustomerImage: UploadedImageType = "";
    let uploadedGuarantorImage1: UploadedImageType = "";
    let uploadedGuarantorImage2: UploadedImageType = "";
    let uploadedCacDocument: UploadedImageType = "";
    let uploadedCustomerIdentificationImage: UploadedImageType = "";
    let uploadedProofOfResidenceImage: UploadedImageType = "";

    const handleImageUploads = async () => {
      toast("Creating new account, please wait...");
      try {
        // for (const item of data.images) {
        if (data.customerPassport) {
          const fileName =
            new Date().getTime() + "-" + data.customerPassport.name;
          const storage = getStorage(firebaseApp);
          const storageRef = ref(storage, `clients/${fileName}`);
          const uploadTask = uploadBytesResumable(
            storageRef,
            data.customerPassport
          );

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
                console.log("Error uploading customer image", error);
                reject(error);
              },
              () => {
                getDownloadURL(uploadTask.snapshot.ref)
                  .then((downloadURL) => {
                    uploadedCustomerImage = downloadURL;

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

        if (data.guarantorPassport1) {
          const fileName =
            new Date().getTime() + "-" + data.guarantorPassport1.name;
          const storage = getStorage(firebaseApp);
          const storageRef = ref(storage, `customer/${fileName}`);
          const uploadTask = uploadBytesResumable(
            storageRef,
            data.guarantorPassport1
          );

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
                console.log("Error uploading Guarantor Passport 1", error);
                reject(error);
              },
              () => {
                getDownloadURL(uploadTask.snapshot.ref)
                  .then((downloadURL) => {
                    uploadedGuarantorImage1 = downloadURL;

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

        if (data.guarantorPassport2) {
          const fileName =
            new Date().getTime() + "-" + data.guarantorPassport2.name;
          const storage = getStorage(firebaseApp);
          const storageRef = ref(storage, `customer/${fileName}`);
          const uploadTask = uploadBytesResumable(
            storageRef,
            data.guarantorPassport2
          );

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
                console.log("Error uploading Guarantor Passport 2", error);
                reject(error);
              },
              () => {
                getDownloadURL(uploadTask.snapshot.ref)
                  .then((downloadURL) => {
                    uploadedGuarantorImage2 = downloadURL;

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
        if (data.customerIdentification) {
          const fileName =
            new Date().getTime() + "-" + data.customerIdentification.name;
          const storage = getStorage(firebaseApp);
          const storageRef = ref(storage, `customer/${fileName}`);
          const uploadTask = uploadBytesResumable(
            storageRef,
            data.customerIdentification
          );

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
                console.log("Error uploading Guarantor Passport 2", error);
                reject(error);
              },
              () => {
                getDownloadURL(uploadTask.snapshot.ref)
                  .then((downloadURL) => {
                    uploadedCustomerIdentificationImage = downloadURL;

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
        if (data.proofOfResidence) {
          const fileName =
            new Date().getTime() + "-" + data.proofOfResidence.name;
          const storage = getStorage(firebaseApp);
          const storageRef = ref(storage, `customer/${fileName}`);
          const uploadTask = uploadBytesResumable(
            storageRef,
            data.proofOfResidence
          );

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
                console.log("Error uploading Guarantor Passport 2", error);
                reject(error);
              },
              () => {
                getDownloadURL(uploadTask.snapshot.ref)
                  .then((downloadURL) => {
                    uploadedProofOfResidenceImage = downloadURL;

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
        if (data.cacDocument) {
          const fileName = new Date().getTime() + "-" + data.cacDocument.name;
          const storage = getStorage(firebaseApp);
          const storageRef = ref(storage, `customer/${fileName}`);
          const uploadTask = uploadBytesResumable(storageRef, data.cacDocument);

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
                console.log("Error uploading CAC document", error);
                reject(error);
              },
              () => {
                getDownloadURL(uploadTask.snapshot.ref)
                  .then((downloadURL) => {
                    uploadedCacDocument = downloadURL;

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
      customerPassport: uploadedCustomerImage,
      guarantorPassport1: uploadedGuarantorImage1,
      guarantorPassport2: uploadedGuarantorImage2,
      cacDocument: uploadedCacDocument,
      customerIdentification: uploadedCustomerIdentificationImage,
      proofOfResidence: uploadedProofOfResidenceImage,
      websiteReg: false,
      role: "CUSTOMER",
      approved: false,
    };

    const emailData = {
      emailList: ["info.promiseudo@gmail.com"],
      subject: `New Account Registration`,
      message: `Hello, <br/>A new account has just been created for ${data?.firstname} ${data?.lastname}  <br/>Go to <a href="https://loan-operations.vercel.app/dashboard/customers" target="_blank">Manage Accounts</a> to start managing this customer's records.
      <br/>Operator: ${currentUser?.firstname} ${currentUser?.lastname} <br/><br/><small>Loanpay App</small>`,
    };

    axios
      .post("/api/register-customer", userData)
      .then(() => {
        toast.success("Account successfully created");
        setIsCustomerCreated(true);
        // router.refresh();
        axios
          .post("/api/send-email", emailData)
          .then(() => {})
          .catch((error) => {
            console.log(error);
            toast.error("Error sending email");
          });
      })
      .catch((error) => {
        toast.error("Something went wrong when creating new account");
      })
      .finally(() => {
        router.refresh();

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

  useEffect(() => {
    if (isCustomerCreated) {
      reset();
      setGuarantorPassportImage2(null);
      setCustomerPassportImage(null);
      setGuarantorPassportImage1(null);
      setProofOfResidenceImage(null);
      setCustomerIdentificationImage(null);
      setCacDocument(null);
      setIsCustomerCreated(false);
    }
  }, [isCustomerCreated]);

  const newAccountOptions = {
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

  const addCustomerPassportToState = useCallback((value: ImageType) => {
    setCustomerPassportImage(value);
  }, []);

  const removeCustomerPassportFromState = useCallback((value: ImageType) => {
    setCustomerPassportImage(null);
  }, []);
  const addGuarantorPassport1ToState = useCallback((value: ImageType) => {
    setGuarantorPassportImage1(value);
  }, []);

  const removeGuarantorPassport1FromState = useCallback((value: ImageType) => {
    setGuarantorPassportImage1(null);
  }, []);
  const addGuarantorPassport2ToState = useCallback((value: ImageType) => {
    setGuarantorPassportImage2(value);
  }, []);

  const removeGuarantorPassport2FromState = useCallback((value: ImageType) => {
    setGuarantorPassportImage2(null);
  }, []);

  const addCustomerIdentificationToState = useCallback((value: ImageType) => {
    setCustomerIdentificationImage(value);
  }, []);

  const removeCustomerIdentificationFromState = useCallback(
    (value: ImageType) => {
      setCustomerIdentificationImage(null);
    },
    []
  );
  const addProofOfResidenceToState = useCallback((value: ImageType) => {
    setProofOfResidenceImage(value);
  }, []);

  const removeProofOfResidenceFromState = useCallback((value: ImageType) => {
    setProofOfResidenceImage(null);
  }, []);

  const addCacDocumentToState = useCallback((value: ImageType) => {
    setCacDocument(value);
  }, []);

  const removeCacDocumentFromState = useCallback((value: ImageType) => {
    setCacDocument(null);
  }, []);

  const customStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      border: "1.5px solid " + (state.isFocused ? "#3C50E0" : "#ced4da"),
      borderRadius: "8px",
      outline: "none",
      height: "48px",
      marginTop: "5px",
      // boxShadow: state.isFocused ? "0 0 5px #5e9fff" : "none",
      // "&:hover": {
      //   border: "2px solid #5e9fff",
      // },
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#5e9fff" : "white",
      color: state.isFocused ? "white" : "black",
    }),
    // Add more styles for other components as needed
  };

  return (
    <>
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            Fill in customer&apos;s details
          </h3>
        </div>
        <div className="flex flex-col gap-5.5 p-6.5">
          <div>
            <label className="flex items-center mb-3  text-black dark:text-white">
              <span> Firstname</span>
              <LuAsterisk color="#D22B2B" />
            </label>
            <input
              id="firstname"
              disabled={isLoading}
              {...register("firstname", newAccountOptions.firstname)}
              type="text"
              name="firstname"
              required
              placeholder="Firstname"
              className={clsx(
                "w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary",
                errors["firstname"]
                  ? "border-rose-400 focus:border-rose-400"
                  : "border-slate-300 focus:border-slate-300"
              )}
            />
          </div>
          <div>
            <label className="flex items-center mb-3  text-black dark:text-white">
              <span> Lastname</span>
              <LuAsterisk color="#D22B2B" />
            </label>
            <input
              id="lastname"
              disabled={isLoading}
              {...register("lastname", newAccountOptions.lastname)}
              type="text"
              name="lastname"
              required
              placeholder="Lastname"
              className={clsx(
                "w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary",
                errors["lastname"]
                  ? "border-rose-400 focus:border-rose-400"
                  : "border-slate-300 focus:border-slate-300"
              )}
            />
          </div>
          <div>
            <label className="flex items-center mb-3  text-black dark:text-white">
              <span> Email</span>
            </label>
            <input
              id="email"
              disabled={isLoading}
              {...register("email", { required: false })}
              type="email"
              name="email"
              required
              placeholder="Email"
              className={clsx(
                "w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary",
                errors["email"]
                  ? "border-rose-400 focus:border-rose-400"
                  : "border-slate-300 focus:border-slate-300"
              )}
            />
          </div>
          <div>
            <label className="flex items-center mb-3  text-black dark:text-white">
              <span> Phone</span>
              <LuAsterisk color="#D22B2B" />
            </label>
            <input
              id="phone"
              disabled={isLoading}
              {...register("phone", { required: true })}
              type="text"
              name="phone"
              required
              placeholder="Phone"
              className={clsx(
                "w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary",
                errors["phone"]
                  ? "border-rose-400 focus:border-rose-400"
                  : "border-slate-300 focus:border-slate-300"
              )}
            />
          </div>
          <div>
            <label className="mb-3 block text-black dark:text-white">
              Alternate Phone
            </label>
            <input
              id="alternatePhone"
              disabled={isLoading}
              {...register("alternatePhone", { required: false })}
              type="text"
              name="alternatePhone"
              required
              placeholder="Alternate Phone"
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center">
              <div className="block">
                <SelectImage
                  item={null}
                  addImageToState={addCustomerIdentificationToState}
                  removeImageFromState={removeCustomerIdentificationFromState}
                  isUserCreated={false}
                  label="Customer Identification"
                />
              </div>
            </div>
            <p className="text-xs">NIN, Driver&apos;s licence or passport</p>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center">
              <div className="block">
                <SelectImage
                  item={null}
                  addImageToState={addProofOfResidenceToState}
                  removeImageFromState={removeProofOfResidenceFromState}
                  isUserCreated={false}
                  label="Proof of residence"
                />
              </div>
            </div>
            <p className="text-xs">Utility bill or rent receipt</p>
          </div>

          <div>
            <label className="flex items-center mb-3  text-black dark:text-white">
              <span> Date of Birth</span>
              <LuAsterisk color="#D22B2B" />
            </label>
            <input
              id="dateOfBirth"
              disabled={isLoading}
              {...register("dateOfBirth", { required: true })}
              type="date"
              name="dateOfBirth"
              required
              placeholder="Date of Birth"
              className={clsx(
                "w-60 rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary",
                errors["dateOfBirth"]
                  ? "border-rose-400 focus:border-rose-400"
                  : "border-slate-300 focus:border-slate-300"
              )}
            />
          </div>

          <div>
            <label className="flex items-center mb-3  text-black dark:text-white">
              <span> Gender</span>
              <LuAsterisk color="#D22B2B" />
            </label>
            <div>
              <Controller
                control={control}
                name="gender"
                rules={{ required: "Gender is required" }}
                render={({ field }) => (
                  <>
                    <div>
                      <label className="flex items-center gap-2">
                        <input type="radio" {...field} value="male" />
                        <span>Male</span>
                      </label>
                    </div>
                    <div>
                      <label className="flex items-center gap-2">
                        <input type="radio" {...field} value="female" />
                        <span>Female</span>
                      </label>
                    </div>
                    <div>
                      <label className="flex items-center gap-2">
                        <input type="radio" {...field} value="other" />
                        <span>Other</span>
                      </label>
                    </div>
                  </>
                )}
              />
            </div>
            <div>
              {errors["gender"] && (
                <em className="text-sm text-rose-400">Select a gender</em>
              )}
            </div>
          </div>
          <div>
            <label className="flex items-center mb-3  text-black dark:text-white">
              <span> Marital Status</span>
              <LuAsterisk color="#D22B2B" />
            </label>
            <div>
              <Controller
                control={control}
                name="maritalStatus"
                rules={{ required: "Marital Status is required" }}
                render={({ field }) => (
                  <>
                    <div>
                      <label className="flex items-center gap-2">
                        <input type="radio" {...field} value="single" />
                        <span>Single</span>
                      </label>
                    </div>
                    <div>
                      <label className="flex items-center gap-2">
                        <input type="radio" {...field} value="married" />
                        <span>Married</span>
                      </label>
                    </div>
                    <div>
                      <label className="flex items-center gap-2">
                        <input type="radio" {...field} value="divorced" />
                        <span>Divorced</span>
                      </label>
                    </div>
                  </>
                )}
              />
            </div>
            <div>
              {errors["maritalStatus"] && (
                <em className="text-sm text-rose-400">
                  Select a marital status
                </em>
              )}
            </div>
          </div>

          <div>
            <label className="flex items-center mb-3  text-black dark:text-white">
              <span> Next of Kin</span>
              <LuAsterisk color="#D22B2B" />
            </label>
            <input
              id="nextOfKin"
              disabled={isLoading}
              {...register("nextOfKin", { required: true })}
              type="text"
              name="nextOfKin"
              required
              placeholder="Next Of Kin"
              className={clsx(
                "w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary",
                errors["nextOfKin"]
                  ? "border-rose-400 focus:border-rose-400"
                  : "border-slate-300 focus:border-slate-300"
              )}
            />
          </div>

          <div>
            <label className="flex items-center mb-3  text-black dark:text-white">
              <span> Next of kin phone</span>
              <LuAsterisk color="#D22B2B" />
            </label>
            <input
              id="nextOfKinPhone"
              disabled={isLoading}
              {...register("nextOfKinPhone", { required: true })}
              type="text"
              name="nextOfKinPhone"
              required
              placeholder="Next Of Kin Phone"
              className={clsx(
                "w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary",
                errors["nextOfKinPhone"]
                  ? "border-rose-400 focus:border-rose-400"
                  : "border-slate-300 focus:border-slate-300"
              )}
            />
          </div>

          <div>
            <label className="text-sm flex items-center">
              <span>Country</span>
              <LuAsterisk color="#D22B2B" />
            </label>
            <Controller
              name="country"
              control={control}
              rules={{ required: "Country is required" }}
              defaultValue={null}
              render={({ field }) => (
                <Select
                  styles={customStyles}
                  {...field}
                  options={geoData.map((country) => ({
                    label: country.name,
                    value: country.iso2,
                  }))}
                  isClearable
                  placeholder="Select country"
                  onChange={(selectedOption) => {
                    setValue("country", selectedOption);
                    setValue("state", null); // Reset state on country change
                  }}
                />
              )}
            />
            <div>
              {errors["country"] && (
                <em className="text-sm text-rose-400">Select a country</em>
              )}
            </div>
          </div>

          <div>
            <label className="text-sm flex items-center">
              <span>State</span>
              <LuAsterisk color="#D22B2B" />
            </label>
            <Controller
              name="state"
              control={control}
              rules={{ required: "State is required" }}
              defaultValue={null}
              render={({ field }) => (
                <Select
                  styles={customStyles}
                  {...field}
                  options={
                    (
                      geoData.find(
                        (country: any) =>
                          country.iso2 === selectedCountry?.value
                      ) || {}
                    ).states?.map((state: any) => ({
                      label: state.name,
                      value: state.state_code,
                    })) || []
                  }
                  isClearable
                  placeholder="Select state"
                />
              )}
            />
            <div>
              {errors["state"] && (
                <em className="text-sm text-rose-400">Select a state</em>
              )}
            </div>
          </div>

          <div>
            <label className="text-sm flex items-center">
              <span>LGA</span>
              <LuAsterisk color="#D22B2B" />
            </label>
            <Controller
              name="lga"
              control={control}
              rules={{ required: "LGA is required" }}
              defaultValue={null}
              render={({ field }) => (
                <Select
                  styles={customStyles}
                  {...field}
                  options={
                    (
                      geoData.find(
                        (country: any) =>
                          country.iso2 === selectedCountry?.value
                      ) || {}
                    ).states
                      ?.find(
                        (state: any) =>
                          state.state_code === selectedState?.value
                      )
                      ?.cities?.map((city: any) => ({
                        label: city.name,
                        value: city.id,
                      })) || []
                  }
                  isClearable
                  placeholder="Select LGA"
                />
              )}
            />
            <div>
              {errors["lga"] && (
                <em className="text-sm text-rose-400">Select an LGA</em>
              )}
            </div>
          </div>

          <div>
            <label className="flex items-center mb-3  text-black dark:text-white">
              <span> Address</span>
              <LuAsterisk color="#D22B2B" />
            </label>
            <input
              id="address"
              disabled={isLoading}
              {...register("address", { required: true })}
              type="text"
              name="address"
              required
              placeholder="Address"
              className={clsx(
                "w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary",
                errors["address"]
                  ? "border-rose-400 focus:border-rose-400"
                  : "border-slate-300 focus:border-slate-300"
              )}
            />
          </div>
          <div>
            <label className="flex items-center mb-3  text-black dark:text-white">
              <span>Customer NIN</span>
              <LuAsterisk color="#D22B2B" />
            </label>
            <input
              id="nin"
              disabled={isLoading}
              {...register("nin", { required: true })}
              type="text"
              name="nin"
              required
              placeholder="Customer NIN"
              className={clsx(
                "w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary",
                errors["address"]
                  ? "border-rose-400 focus:border-rose-400"
                  : "border-slate-300 focus:border-slate-300"
              )}
            />
          </div>

          <div>
            <label className="flex items-center mb-3  text-black dark:text-white">
              <span> Net Monthly Income</span>
              <LuAsterisk color="#D22B2B" />
            </label>
            <input
              id="netMonthlyIncome"
              disabled={isLoading}
              {...register("netMonthlyIncome", { required: true })}
              type="number"
              name="netMonthlyIncome"
              required
              placeholder="Net Monthly Income"
              className={clsx(
                "w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary",
                errors["netMonthlyIncome"]
                  ? "border-rose-400 focus:border-rose-400"
                  : "border-slate-300 focus:border-slate-300"
              )}
            />
          </div>

          <div>
            <label className="flex items-center mb-3  text-black dark:text-white">
              <span>Desired Loan Amount</span>
              <LuAsterisk color="#D22B2B" />
            </label>
            <input
              id="desiredLoanAmount"
              disabled={isLoading}
              {...register("desiredLoanAmount", { required: true })}
              type="number"
              name="desiredLoanAmount"
              required
              placeholder="Loan Amount"
              className={clsx(
                "w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary",
                errors["desiredLoanAmount"]
                  ? "border-rose-400 focus:border-rose-400"
                  : "border-slate-300 focus:border-slate-300"
              )}
            />
          </div>

          <div>
            <label className="flex items-center mb-3  text-black dark:text-white">
              <span>Purpose of Loan</span>
              <LuAsterisk color="#D22B2B" />
            </label>
            <input
              id="purposeOfLoan"
              disabled={isLoading}
              {...register("purposeOfLoan", { required: true })}
              type="text"
              name="purposeOfLoan"
              required
              placeholder="Purpose of loan"
              className={clsx(
                "w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary",
                errors["purposeOfLoan"]
                  ? "border-rose-400 focus:border-rose-400"
                  : "border-slate-300 focus:border-slate-300"
              )}
            />
          </div>

          <div>
            <label className="flex items-center mb-3  text-black dark:text-white">
              <span> How did you hear about us?</span>
              <LuAsterisk color="#D22B2B" />
            </label>
            <Controller
              control={control}
              name="howYouHeard"
              rules={{ required: "Select how they heard about us" }}
              render={({ field }) => (
                <>
                  <div>
                    <label className="flex items-center gap-2">
                      <input type="radio" {...field} value="google" />
                      <span>Google</span>
                    </label>
                  </div>
                  <div>
                    <label className="flex items-center gap-2">
                      <input type="radio" {...field} value="facebook" />
                      <span>Facebook</span>
                    </label>
                  </div>
                  <div>
                    <label className="flex items-center gap-2">
                      <input type="radio" {...field} value="instagram" />
                      <span>Instagram</span>
                    </label>
                  </div>
                  <div>
                    <label className="flex items-center gap-2">
                      <input type="radio" {...field} value="referral" />
                      <span>Referral</span>
                    </label>
                  </div>
                  <div>
                    <label className="flex items-center gap-2">
                      <input type="radio" {...field} value="other" />
                      <span>Other</span>
                    </label>
                  </div>
                </>
              )}
            />
            <div>
              {errors["howYouHeard"] && (
                <em className="text-sm text-rose-400">
                  Select how they heard about us
                </em>
              )}
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center">
              <div className="block">
                <SelectImage
                  item={null}
                  addImageToState={addCustomerPassportToState}
                  removeImageFromState={removeCustomerPassportFromState}
                  isUserCreated={false}
                  label="Customer Passport"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="flex items-center mb-3  text-black dark:text-white">
              <span> Guarantor Name 1</span>
            </label>
            <input
              id="guarantorName1"
              disabled={isLoading}
              {...register("guarantorName1", { required: false })}
              type="text"
              name="guarantorName1"
              placeholder="Guarantor Name 1"
              className={clsx(
                "w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary",
                errors["guarantorName1"]
                  ? "border-rose-400 focus:border-rose-400"
                  : "border-slate-300 focus:border-slate-300"
              )}
            />
          </div>
          <div>
            <label className="flex items-center mb-3  text-black dark:text-white">
              <span> Guarantor Phone 1</span>
            </label>
            <input
              id="guarantorPhone1"
              disabled={isLoading}
              {...register("guarantorPhone1", { required: false })}
              type="text"
              name="guarantorPhone1"
              required
              placeholder="Guarantor Phone 1"
              className={clsx(
                "w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary",
                errors["guarantorPhone1"]
                  ? "border-rose-400 focus:border-rose-400"
                  : "border-slate-300 focus:border-slate-300"
              )}
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center">
              <div className="block">
                <SelectImage
                  item={null}
                  addImageToState={addGuarantorPassport1ToState}
                  removeImageFromState={removeGuarantorPassport1FromState}
                  isUserCreated={false}
                  label="Guarantor 1 Passport"
                />
              </div>
            </div>
          </div>
          <div>
            <label className="flex items-center mb-3  text-black dark:text-white">
              <span> Guarantor Name 2</span>
            </label>
            <input
              id="guarantorName2"
              disabled={isLoading}
              {...register("guarantorName2", { required: false })}
              type="text"
              name="guarantorName2"
              required
              placeholder="Guarantor Name 2"
              className={clsx(
                "w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary",
                errors["guarantorName2"]
                  ? "border-rose-400 focus:border-rose-400"
                  : "border-slate-300 focus:border-slate-300"
              )}
            />
          </div>
          <div>
            <label className="flex items-center mb-3  text-black dark:text-white">
              <span>Guarantor Phone 2</span>
            </label>
            <input
              id="guarantorPhone2"
              disabled={isLoading}
              {...register("guarantorPhone2", { required: false })}
              type="text"
              name="guarantorPhone2"
              required
              placeholder="Guarantor Phone 2"
              className={clsx(
                "w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary",
                errors["guarantorPhone2"]
                  ? "border-rose-400 focus:border-rose-400"
                  : "border-slate-300 focus:border-slate-300"
              )}
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center">
              <div className="block">
                <SelectImage
                  item={null}
                  addImageToState={addGuarantorPassport2ToState}
                  removeImageFromState={removeGuarantorPassport2FromState}
                  isUserCreated={false}
                  label="Guarantor 2 Passport"
                />
              </div>
            </div>
          </div>

          <div className="w-full flex items-center justify-start">
            <button
              type="button"
              onClick={() => setAddBusinessInfo(!addBusinessInfo)}
              className="flex items-center h-4  text-sm justify-center rounded bg-success p-3 font-medium text-gray"
            >
              {addBusinessInfo ? "Hide Extra Fields" : "Show Extra Fields"}
            </button>
          </div>

          {addBusinessInfo && (
            <>
              <div>
                <label className="flex items-center mb-3  text-black dark:text-white">
                  <span>Business Name</span>
                  <LuAsterisk color="#D22B2B" />
                </label>
                <input
                  id="businessName"
                  disabled={isLoading}
                  {...register("businessName", {
                    required: addBusinessInfo === true,
                  })}
                  type="text"
                  name="businessName"
                  required
                  placeholder="Business Name"
                  className={clsx(
                    "w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary",
                    errors["businessName"]
                      ? "border-rose-400 focus:border-rose-400"
                      : "border-slate-300 focus:border-slate-300"
                  )}
                />
              </div>

              <div>
                <label className="mb-3 block text-black dark:text-white">
                  Business Type{" "}
                </label>
                <Controller
                  control={control}
                  name="businessType"
                  rules={{ required: "Business Type is required" }}
                  render={({ field }) => (
                    <>
                      <div>
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            {...field}
                            value="Sole Proprietorship"
                          />
                          <span>Sole Proprietorship</span>
                        </label>
                      </div>
                      <div>
                        <label className="flex items-center gap-2">
                          <input type="radio" {...field} value="Partnership" />
                          <span>Partnership</span>
                        </label>
                      </div>
                      <div>
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            {...field}
                            value="Limited liability company"
                          />
                          <span>Limited liability company</span>
                        </label>
                      </div>
                    </>
                  )}
                />
                <div>
                  {errors["businessType"] && (
                    <em className="text-sm text-rose-400">
                      Select business type
                    </em>
                  )}
                </div>
              </div>

              <div>
                <label className="flex items-center mb-3  text-black dark:text-white">
                  <span> Business Phone</span>
                  <LuAsterisk color="#D22B2B" />
                </label>
                <input
                  id="businessPhone"
                  disabled={isLoading}
                  {...register("businessPhone", {
                    required: addBusinessInfo === true,
                  })}
                  type="text"
                  name="businessPhone"
                  required
                  placeholder="Business Phone"
                  className={clsx(
                    "w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary",
                    errors["businessPhone"]
                      ? "border-rose-400 focus:border-rose-400"
                      : "border-slate-300 focus:border-slate-300"
                  )}
                />
              </div>
              <div>
                <label className="flex items-center mb-3  text-black dark:text-white">
                  <span> Business Email</span>
                  <LuAsterisk color="#D22B2B" />
                </label>
                <input
                  id="businessEmail"
                  disabled={isLoading}
                  {...register("businessEmail", {
                    required: addBusinessInfo === true,
                  })}
                  type="text"
                  name="businessEmail"
                  required
                  placeholder="Business Email"
                  className={clsx(
                    "w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary",
                    errors["businessEmail"]
                      ? "border-rose-400 focus:border-rose-400"
                      : "border-slate-300 focus:border-slate-300"
                  )}
                />
              </div>

              <div>
                <label className="flex items-center mb-3  text-black dark:text-white">
                  <span>Business Address</span>
                  <LuAsterisk color="#D22B2B" />
                </label>
                <input
                  id="businessAddress"
                  disabled={isLoading}
                  {...register("businessAddress", {
                    required: addBusinessInfo === true,
                  })}
                  type="text"
                  name="businessAddress"
                  required
                  placeholder="Business address"
                  className={clsx(
                    "w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary",
                    errors["businessAddress"]
                      ? "border-rose-400 focus:border-rose-400"
                      : "border-slate-300 focus:border-slate-300"
                  )}
                />
              </div>

              <div>
                <label className="flex items-center mb-3  text-black dark:text-white">
                  <span> CAC Number</span>
                  <LuAsterisk color="#D22B2B" />
                </label>
                <input
                  id="cacNumber"
                  disabled={isLoading}
                  {...register("cacNumber", {
                    required: addBusinessInfo === true,
                  })}
                  type="text"
                  name="cacNumber"
                  required
                  placeholder="CAC Number"
                  className={clsx(
                    "w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary",
                    errors["cacNumber"]
                      ? "border-rose-400 focus:border-rose-400"
                      : "border-slate-300 focus:border-slate-300"
                  )}
                />
              </div>

              <div className="flex flex-col">
                <div className="flex items-center">
                  <div className="block">
                    <SelectImage
                      item={null}
                      addImageToState={addCacDocumentToState}
                      removeImageFromState={removeCacDocumentFromState}
                      isUserCreated={false}
                      label="CAC Document"
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          <div>
            <label className="mb-3 block text-black dark:text-white">
              Comments or Questions
            </label>
            <textarea
              id="comments"
              disabled={isLoading}
              {...register("comments", { required: false })}
              name="comments"
              style={{
                resize: "none",
              }}
              placeholder="Comments or questions"
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
          </div>

          <div className="w-full flex items-center justify-center">
            <button
              disabled={isLoading}
              onClick={handleSubmit(onSubmit)}
              className="flex  justify-center rounded bg-primary p-3 font-medium text-gray"
            >
              {isLoading ? "Submitting..." : " Create Account"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewAccountForm;
