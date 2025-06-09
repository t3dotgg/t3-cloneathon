import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import PlausibleProvider from "next-plausible";
import { SessionProvider } from "next-auth/react";
import MainNav from "@/components/layout/main-nav"; // Import the new MainNav component
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "T3 Chat Cloneathon",
  description:
    "Build an open source clone of T3 Chat and compete for over $10,000 in prizes.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <PlausibleProvider domain="cloneathon.t3.gg">
        <html lang="en" className="dark">
          <body className={`${inter.className} flex flex-col min-h-screen`}>
            <MainNav /> {/* Add MainNav component here */}
            <main className="flex-grow"> {/* Ensure children take up remaining space */}
              {children}
            </main>
          </body>
        </html>
      </PlausibleProvider>
    </SessionProvider>
  );
}
