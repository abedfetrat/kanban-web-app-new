"use client";

import { auth } from "@/firebase/config";
import {
  GithubAuthProvider,
  GoogleAuthProvider,
  signInAnonymously,
  signInWithPopup,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Button from "../components/Button";

export default function LoginPage() {
  const router = useRouter();

  const handleGoogleLogIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.log(error);
      toast.error("Error while logging in. Please try again.");
    }
  };

  const handleGitHubLogIn = async () => {
    try {
      const provider = new GithubAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.log(error);
      toast.error("Error while logging in. Please try again.");
    }
  };

  const handleGuestLogIn = async () => {
    try {
      await signInAnonymously(auth);
    } catch (error) {
      console.log(error);
      toast.error("Error while logging in. Please try again.");
    }
  };

  return (
    <>
      <h2 className="mb-4 text-2xl font-bold">Login</h2>
      <p className="mb-6 font-bold text-medium-grey md:mb-8">
        Log in to sync your boards and tasks accross your devices.
      </p>
      <div className="flex flex-col gap-4">
        <Button
          color="primary"
          size="large"
          className="w-full"
          onClick={handleGoogleLogIn}
        >
          Continue with Google
        </Button>
        <Button
          color="primary"
          size="large"
          className="w-full"
          onClick={handleGitHubLogIn}
        >
          Continue with GitHub
        </Button>
        <Button
          color="primary"
          size="large"
          className="w-full"
          onClick={() => router.push("/login/email")}
        >
          Continue with Email
        </Button>
        <div className="flex items-center gap-x-4">
          <span className="h-[2px] w-full bg-light-border dark:bg-dark-border"></span>
          <span className="text-medium-grey">or</span>
          <span className="h-[2px] w-full bg-light-border dark:bg-dark-border"></span>
        </div>
        <Button
          color="secondary"
          size="large"
          className="w-full"
          onClick={handleGuestLogIn}
        >
          Continue as Guest
        </Button>
      </div>
    </>
  );
}
