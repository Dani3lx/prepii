"use client";

import React from "react";
import { Button } from "./ui/button";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/client";
import { clearSessionCookie } from "@/lib/actions/auth.action";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Navbar = ({ isAuthenticated }: { isAuthenticated: boolean }) => {
  const router = useRouter();
  const handleOnClick = async () => {
    if (isAuthenticated) {
      await signOut(auth);
      await clearSessionCookie();
    }
    router.push("/sign-in");
  };
  return (
    <nav className="sticky top-0 left-0 w-screen flex justify-center items-center border alt-background backdrop-blur z-20">
      <div className="py-4 flex flex-row justify-between container px-8">
        <Link href="/" className="font-bold text-2xl">
          Prepii
        </Link>
        {isAuthenticated ? (
          <Button
            className="bg-white"
            variant="outline"
            onClick={handleOnClick}
          >
            Sign out
          </Button>
        ) : (
          <div className="flex gap-4">
            <Button variant="ghost" asChild>
              <Link href={"/sign-in"}>Log in</Link>
            </Button>
            <Button onClick={handleOnClick} asChild>
              <Link href={"/sign-up"}>Get Prepii free</Link>
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
