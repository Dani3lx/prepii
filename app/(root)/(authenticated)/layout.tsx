import { isAuthenticated } from "@/lib/data/auth.data";
import { redirect } from "next/navigation";
import React, { ReactNode } from "react";

const AuthenticatedLayout = async ({ children }: { children: ReactNode }) => {
  const isUserAuthenticated = await isAuthenticated();
  if (!isUserAuthenticated) redirect("/sign-in");
  return <>{children}</>;
};

export default AuthenticatedLayout;
