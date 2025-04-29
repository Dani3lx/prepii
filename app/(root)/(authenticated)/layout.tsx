import { redirect } from "next/navigation";
import React, { ReactNode } from "react";

const AuthenticatedLayout = ({ children }: { children: ReactNode }) => {
  // If not logged in, redirect to sign up page
  const isLoggedIn = true;
  if (!isLoggedIn) redirect("/sign-in");
  return (
    <div>
      <nav>Navbar logged in</nav>
      {children}
    </div>
  );
};

export default AuthenticatedLayout;
