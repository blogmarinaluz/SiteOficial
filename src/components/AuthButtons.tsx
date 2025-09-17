// src/components/AuthButtons.tsx
"use client";

import { SignedIn, SignedOut, UserButton, SignInButton } from "@clerk/nextjs";

export default function AuthButtons() {
  return (
    <div className="flex items-center gap-2">
      <SignedOut>
        <SignInButton mode="redirect">
          <button
            className="rounded-xl border px-3 py-2 text-sm font-medium hover:bg-zinc-50"
            title="Entrar ou criar conta"
          >
            Entrar
          </button>
        </SignInButton>
      </SignedOut>

      <SignedIn>
        <UserButton
          appearance={{ elements: { userButtonPopoverCard: "rounded-2xl border shadow-xl" } }}
        />
      </SignedIn>
    </div>
  );
}
