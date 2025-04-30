"use server";
import { ONE_WEEK } from "@/constants";
import { auth, db } from "@/firebase/admin";
import { cookies } from "next/headers";

export const createUser = async (
  param: CreateUserParams
): Promise<ServerResponse> => {
  const { uid, name, email } = param;
  const userRef = db.collection("users").doc(uid);
  try {
    const user = await userRef.get();

    if (user.exists) {
      return {
        success: false,
        message: "User already exist",
      };
    }

    await userRef.set({
      name,
      email,
    });

    return {
      success: true,
      message: "Account created successfully. Please sign in.",
    };
  } catch (error) {
    console.error("Error creating user: ", error);

    return {
      success: false,
      message: "An error occurred while creating the user.",
    };
  }
};

export const signIn = async (param: SignInParams): Promise<ServerResponse> => {
  const { email, idToken } = param;
  try {
    const user = auth.getUserByEmail(email);

    if (!user) {
      return {
        success: false,
        message: "User does not exist.",
      };
    }

    await setSessionCookie(idToken);

    return {
      success: true,
      message: "Sign in was successful!",
    };
  } catch (error) {
    console.error("Error signing in user: ", error);

    return {
      success: false,
      message: "An error occurred while signing in the user.",
    };
  }
};

const setSessionCookie = async (idToken: string) => {
  const cookieStore = await cookies();

  const sessionCookie = await auth.createSessionCookie(idToken, {
    expiresIn: ONE_WEEK,
  });

  cookieStore.set("prepii-user-session", sessionCookie, {
    maxAge: ONE_WEEK,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
  });
};

export const getCurrentUser = async (): Promise<User | null> => {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("prepii-user-session")?.value;

  if (!sessionCookie) return null;

  try {
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);

    const userRecord = await db
      .collection("users")
      .doc(decodedClaims.uid)
      .get();

    if (!userRecord.exists) return null;

    return {
      ...userRecord.data(),
      id: userRecord.id,
    } as User;
  } catch (error) {
    console.error("Error getting current user: ", error);
    return null;
  }
};

export const isAuthenticated = async (): Promise<boolean> => {
  const user = await getCurrentUser();
  return !!user;
};
