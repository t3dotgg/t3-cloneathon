import type React from "react";
import { ConvexClientProvider } from "./convex-provider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ConvexClientProvider>{children}</ConvexClientProvider>;
}
