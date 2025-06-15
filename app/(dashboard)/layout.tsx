import type React from "react";
import { ConvexClientProvider } from "./convex-provider";

import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
} from "@clerk/nextjs";

import TopNav from "./TopNav";
import { Button } from "@/components/ui/button";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <SignedOut>
        <div className="flex justify-center items-center min-h-screen">
          <SignInButton>
            <Button className="bg-white text-black">Sign In With GitHub</Button>
          </SignInButton>
        </div>
      </SignedOut>
      <SignedIn>
        <div className="flex flex-col min-h-screen bg-black">
          <TopNav />
          <ConvexClientProvider>{children}</ConvexClientProvider>
        </div>
      </SignedIn>
    </ClerkProvider>
  );
}
