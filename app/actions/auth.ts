"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logoutAction() {
  const cookieStore = await cookies();
  
  // Clear the actual provia_session cookie used by your application
  cookieStore.delete("provia_session");

  redirect("/");
}