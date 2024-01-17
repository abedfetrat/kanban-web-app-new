"use client";

import { redirect } from "next/navigation";
import { useAuthState } from "./providers/AuthStateProvider";
import Button from "./components/Button";
import { auth } from "@/firebase/config";

export default function Page() {
  const { isAuthenticated, isLoading } = useAuthState();

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    redirect("/login");
  }

  return (
    <main>
      <h1>Home</h1>
      <Button color="primary" size="small" onClick={() => auth.signOut()}>
        Logout
      </Button>
    </main>
  );
}
