import React from "react";
import { Button } from "./ui/button";

const Navbar = ({ isAuthenticated }: { isAuthenticated: boolean }) => {
  return (
    <nav className="fixed top-0 left-0 w-screen px-80 py-4 flex flex-row justify-between drop-shadow-2xl border">
      <h1 className="font-bold text-2xl">Prepii</h1>
      <Button>{isAuthenticated ? "Sign out" : "Sign In"}</Button>
    </nav>
  );
};

export default Navbar;
