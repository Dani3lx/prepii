import { redirect } from "next/navigation";
import React, { ReactNode } from "react";

const RootLayout = ({ children }: { children: ReactNode }) => {
  // If logged in, skip landing page and go straight to dashboard
  const loggedIn = false;
  if (loggedIn) redirect("/dashboard");
  return (
    <div>
      <nav>Navbar not logged in</nav>
      {children}
    </div>
  );
};

export default RootLayout;
