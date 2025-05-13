"use server";

import { signIn, signOut } from "@/auth";
import { signInFormSchema } from "../validators";
import { isRedirectError } from "next/dist/client/components/redirect-error";

// signin with credentials
export async function signInWithCredentials(
  prevState: unknown,
  formData: FormData
) {
  try {
    const user = signInFormSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });
    await signIn("credentials", user);
    return { success: true, message: "Sign in successful!" };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return { sucess: false, message: "Invalid email or password" };
  }
}

// signout
export async function signOutUser() {
  await signOut();
}
