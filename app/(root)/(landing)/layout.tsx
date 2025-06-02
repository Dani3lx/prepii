import { isAuthenticated } from "@/lib/data/auth.data";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

const LandingLayout = async ({ children }: { children: ReactNode }) => {
  const isUserAuthenticated = await isAuthenticated();
  if (isUserAuthenticated) redirect("/dashboard");
  return <>{children}</>;
};

export default LandingLayout;
