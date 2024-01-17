"use client";

import { redirect } from "next/navigation";
import Home from "./home/Home";
import { useAuthState } from "./providers/AuthStateProvider";

export default function Page() {
  const { isAuthenticated, isLoading } = useAuthState();

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    redirect("/login");
  }

  return <Home />;
}
