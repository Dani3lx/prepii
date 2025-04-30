import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { isAuthenticated } from "@/lib/actions/auth.action";
import Navbar from "@/components/Navbar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Prepii",
  description:
    "An AI powered platform for preparing for behavioural interviews",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isUserAuthenticated = await isAuthenticated();
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased mx-80`}>
        <Navbar isAuthenticated={isUserAuthenticated} />
        <div className="mt-16">{children}</div>
        <Toaster />
      </body>
    </html>
  );
}
