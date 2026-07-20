"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { createToken, setAuthCookie, verifyPassword } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import z from "zod";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export async function login(formData: FormData) {
  const rawData = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const result = loginSchema.safeParse(rawData);
  if (!result.success) {
    return { error: result.error.flatten().fieldErrors };
  }
  const { email, password } = result.data;

  try {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()))
      .limit(1);

    if (!user) {
      return { error: { _form: ["Invalid email or password"] } };
    }

    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return { error: { _form: ["Invalid email or password"] } };
    }

    const token = await createToken({
      userId: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    });

    await setAuthCookie(token);
  } catch (error) {
    console.error("Login error:", error);
    return { error: { _form: ["Something went wrong. Please try again."] } };
  }

  redirect("/dashboard");
}
