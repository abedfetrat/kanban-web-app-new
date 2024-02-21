"use client";

import Button from "@/app/components/Button";
import Input from "@/app/components/Input";
import { useMounted } from "@/app/hooks/useMounted";
import { auth } from "@/firebase/config";
import {
  isSignInWithEmailLink,
  sendSignInLinkToEmail,
  signInWithEmailLink,
} from "firebase/auth";
import Link from "next/link";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";

type Inputs = {
  email: string;
};

const STORAGE_EMAIL_KEY = "emailForSignIn";

export default function Page() {
  const mounted = useMounted();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      email: localStorage?.getItem(STORAGE_EMAIL_KEY) || "",
    },
  });
  const [success, setSuccess] = useState(false);
  const link = location?.href;
  const isSignIn = isSignInWithEmailLink(auth, link);

  const onSubmit: SubmitHandler<Inputs> = async ({ email }) => {
    if (isSignIn) {
      try {
        await signInWithEmailLink(auth, email, link);
        localStorage.removeItem(STORAGE_EMAIL_KEY);
      } catch (error) {
        console.log(error);
        toast.error("Error while loggin in. Please try again.");
      }
    } else {
      try {
        const actionCodeSettings = {
          url: process.env.NEXT_PUBLIC_APP_DOMAIN_URL + "/login/email",
          handleCodeInApp: true,
        };
        await sendSignInLinkToEmail(auth, email, actionCodeSettings);
        setSuccess(true);
        localStorage.setItem(STORAGE_EMAIL_KEY, email);
      } catch (error) {
        console.log(error);
        toast.error("Error while sending login link. Please try again soon.");
      }
    }
  };

  if (!mounted) return null;

  return (
    <div className="h-full">
      {success ? (
        <>
          <h2 className="mb-4 text-xl font-bold">Success</h2>
          <p className="mb-8 font-bold text-medium-grey">
            Use the link we have sent to your email to log in.
          </p>
        </>
      ) : (
        <>
          <h2 className="mb-4 text-2xl font-bold">Log in with email</h2>
          <p className="mb-6 font-bold text-medium-grey">
            {isSignIn
              ? "Enter your email address to log in."
              : "Enter an email address you want to log in with. We'll send you a link that you can use to log in."}
          </p>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Input
              wrapperClassName="mb-2"
              className="w-full"
              placeholder="Email address"
              {...register("email", {
                required: true,
                pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              })}
              error={errors?.email && "Please enter an email address."}
            />
            <Button
              className="mb-8 mt-2 w-full"
              color="primary"
              size="large"
              type="submit"
            >
              {isSignIn ? "Log in" : "Send link"}
            </Button>
          </form>
        </>
      )}
      <Link
        href="/login"
        className="flex items-center gap-x-2 text-medium-grey transition-colors hocus:text-black dark:hocus:text-white"
      >
        <svg width="12" height="9" viewBox="0 0 10 7" className="-rotate-90">
          <path
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            d="M9 6 5 2 1 6"
          />
        </svg>
        <p className="text-sm font-bold">Other ways to log in</p>
      </Link>
    </div>
  );
}
