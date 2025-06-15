import type React from "react";
import { ConvexClientProvider } from "./convex-provider";

import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <SignedOut>
        <SignInButton />
        <SignUpButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
        <ConvexClientProvider>{children}</ConvexClientProvider>
      </SignedIn>
    </ClerkProvider>
  );
}
