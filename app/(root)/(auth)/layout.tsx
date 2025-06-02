import { isAuthenticated } from "@/lib/data/auth.data";
import { redirect } from "next/navigation";
import React, { ReactNode } from "react";

const AuthLayout = async ({ children }: { children: ReactNode }) => {
  const isUserAuthenticated = await isAuthenticated();
  if (isUserAuthenticated) redirect("/dashboard");
  return <>{children}</>;
};

export default AuthLayout;
