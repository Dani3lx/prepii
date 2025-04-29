import { redirect } from "next/navigation";
import React, { ReactNode } from "react";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  // If user is already logged in, redirect user to dashboard
  const isLoggedIn = false;
  if (isLoggedIn) redirect("/dashboard");
  return <div>{children}</div>;
};

export default AuthLayout;
