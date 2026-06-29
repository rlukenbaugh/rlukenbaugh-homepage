import type { NextMiddleware } from "next/server";
import { NextResponse } from "next/server";
import { isClerkConfigured } from "@/lib/site";

const clerkConfigured = isClerkConfigured();

let proxyImpl: NextMiddleware = () => NextResponse.next();

if (clerkConfigured) {
  const { clerkMiddleware, createRouteMatcher } = await import("@clerk/nextjs/server");

  const isProtectedRoute = createRouteMatcher([
    "/dashboard(.*)",
    "/account(.*)",
    "/api/checkout(.*)",
    "/api/customer-portal(.*)",
  ]);

  proxyImpl = clerkMiddleware(async (auth, req) => {
    if (isProtectedRoute(req)) {
      await auth.protect();
    }
  });
}

export default proxyImpl;

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
