"use client";

import { SignOutButton } from "@clerk/nextjs";

export function SignOutButtonPill({
  className,
}: {
  className?: string;
}) {
  return (
    <SignOutButton>
      <button className={className} type="button">
        Sign out
      </button>
    </SignOutButton>
  );
}
