"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function MainNav() {
  const { data: session, status } = useSession();
  const isLoading = status === "loading";

  return (
    <nav className="bg-card shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-foreground">
              MyApp
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {isLoading ? (
              <div className="text-sm text-muted-foreground">Loading...</div>
            ) : session ? (
              <>
                <Link
                  href="/chat"
                  className="text-sm font-medium text-foreground hover:text-primary"
                >
                  Chat
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  Logout ({session.user?.email || session.user?.name})
                </Button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-foreground hover:text-primary"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="text-sm font-medium text-foreground hover:text-primary"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
