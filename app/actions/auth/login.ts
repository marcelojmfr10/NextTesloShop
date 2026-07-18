"use server";

import { signIn } from "@/app/auth.config";
import { sleep } from "@/app/utils";
import { AuthError } from "next-auth";

// ...

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Credenciales incorrectas.";
        default:
          return "Something went wrong.";
      }
    }
  }
}
