import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import PlausibleProvider from "next-plausible";
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
    <PlausibleProvider domain="cloneathon.t3.gg">
      <html lang="en" className="dark">
        <body className={inter.className}>{children}</body>
      </html>
    </PlausibleProvider>
  );
}
