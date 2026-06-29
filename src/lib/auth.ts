import { isClerkConfigured } from "@/lib/site";

export async function getOptionalAuth() {
  if (!isClerkConfigured()) {
    return { userId: null };
  }

  const { auth } = await import("@clerk/nextjs/server");
  return auth();
}

export async function getOptionalCurrentUser() {
  if (!isClerkConfigured()) {
    return null;
  }

  const { currentUser } = await import("@clerk/nextjs/server");
  return currentUser();
}
