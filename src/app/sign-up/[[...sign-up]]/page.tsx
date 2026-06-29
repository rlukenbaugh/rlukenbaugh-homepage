import { isClerkConfigured } from "@/lib/site";

export default async function SignUpPage() {
  if (!isClerkConfigured()) {
    return (
      <main className="app-shell grid min-h-screen place-items-center px-4 py-10">
        <section className="max-w-lg rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 text-center">
          <h1 className="text-3xl font-semibold text-white">Clerk not configured yet</h1>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            Add `CLERK_SECRET_KEY` and `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` to enable real account
            creation and trial checkout.
          </p>
        </section>
      </main>
    );
  }

  const { SignUp } = await import("@clerk/nextjs");

  return (
    <main className="app-shell grid min-h-screen place-items-center px-4 py-10">
      <SignUp />
    </main>
  );
}
