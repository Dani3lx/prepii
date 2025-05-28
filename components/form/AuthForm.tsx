"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import FormField from "./FormField";
import Link from "next/link";
import { auth } from "@/firebase/client";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { createUser, signIn } from "@/lib/actions/auth.action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { AuthError } from "firebase/auth";

const authFormSchema = (type: authType) => {
  return z
    .object({
      firstname:
        type === "sign-up" ? z.string().min(1).max(20) : z.string().optional(),
      lastname:
        type === "sign-up" ? z.string().min(1).max(20) : z.string().optional(),
      email: z.string().email(),
      password: z.string().min(8),
      confirmPassword:
        type === "sign-up" ? z.string().min(8) : z.string().optional(),
    })
    .refine(
      (data) => type === "sign-in" || data.password === data.confirmPassword,
      { message: "Passwords do not match", path: ["confirmPassword"] }
    );
};

const AuthForm = ({ type }: { type: authType }) => {
  const formSchema = authFormSchema(type);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const router = useRouter();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (isSignIn) {
        const { email, password } = values;
        const userCredentials = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        const idToken = await userCredentials.user.getIdToken();

        if (!idToken) {
          toast.error("Sign in failed.");
          return;
        }

        const res = await signIn({ idToken, email });

        if (!res.success) {
          toast.error(res.message);
          return;
        }

        toast.success(res.message);
        router.push("/dashboard");
      } else {
        const { firstname, lastname, email, password } = values;
        if (!firstname || !lastname) {
          return;
        }

        const userCredentials = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        const res = await createUser({
          uid: userCredentials.user.uid,
          firstname: firstname,
          lastname: lastname,
          email: email,
        });

        if (!res?.success) {
          toast.error(res?.message);
          return;
        }

        toast.success("Account created successfully. Please sign in.");
        router.push("/sign-in");
      }
    } catch (error: unknown) {
      const err = error as AuthError;
      let message = "Something went wrong.";

      switch (err.code) {
        case "auth/user-not-found":
          message = "No user found with this email.";
          break;
        case "auth/invalid-credential":
          message = "Incorrect email or password.";
          break;
        case "auth/email-already-in-use":
          message = "User already exists. Please use a different email.";
          break;
      }

      console.error("Sign-in error:", error);
      toast.error(message);
    }
  }

  const isSignIn = type == "sign-in";

  return (
    <div className="flex container px-8 fixed h-dvh top-0 items-center justify-center">
      <div className="w-full max-w-lg p-8 border-gray-200 border rounded-xl alt-background">
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
                name="firstname"
                label="First Name"
                placeholder="Your first name"
              />
            )}

            {!isSignIn && (
              <FormField
                control={form.control}
                name="lastname"
                label="Last Name"
                placeholder="Your last name"
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
              description="At least 8 characters"
            />
            {!isSignIn && (
              <FormField
                control={form.control}
                name="confirmPassword"
                label="Confirm Password"
                placeholder="Retype password"
                type="password"
              />
            )}
            <Button type="submit" className="w-full">
              {isSignIn ? "Sign In" : "Sign Up"}
            </Button>
          </form>
          <div className="w-full flex flex-row justify-center items-center text-sm text-gray-500 gap-1 mt-4">
            <p>
              {isSignIn ? "Don't have an account?" : "Already have an account?"}
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
