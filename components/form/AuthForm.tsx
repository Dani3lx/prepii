"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import FormField from "./FormField";
import Link from "next/link";

const authFormSchema = (type: authType) => {
  return z.object({
    name:
      type === "sign-up" ? z.string().min(3).max(20) : z.string().optional(),
    email: z.string().email(),
    password: z.string().min(8),
  });
};

const AuthForm = ({ type }: { type: authType }) => {
  const formSchema = authFormSchema(type);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  const isSignIn = type == "sign-in";

  return (
    <div className="flex min-h-svh w-full items-center justify-center">
      <div className="w-full max-w-lg p-8 border-gray-200 border rounded-xl">
        <div className="flex flex-col gap-2 mb-6">
          <h1 className="text-2xl font-bold">
            {isSignIn ? "Sign In" : "Create an account"}
          </h1>
          <p className="text-sm text-gray-500">
            {isSignIn
              ? "Enter your email and password below to login to your account"
              : "Enter the following details to create an account"}
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {!isSignIn && (
              <FormField
                control={form.control}
                name="name"
                label="Name"
                placeholder="Your name"
              />
            )}

            <FormField
              control={form.control}
              name="email"
              label="Email"
              placeholder="Your email address"
              type="email"
            />
            <FormField
              control={form.control}
              name="password"
              label="Password"
              placeholder="Your password"
              type="password"
            />
            <Button type="submit" className="w-full">
              {isSignIn ? "Sign In" : "Sign Up"}
            </Button>
          </form>
          <div className="w-full flex flex-row justify-center items-center text-sm text-gray-500 gap-1 mt-4">
            <p>
              {isSignIn
                ? "Don&apos;t have an account?"
                : "Already have an account?"}
            </p>
            <Link
              href={isSignIn ? "/sign-up" : "/sign-in"}
              className="underline underline-offset-4"
            >
              {isSignIn ? "Sign up today!" : "Sign in here!"}
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default AuthForm;
