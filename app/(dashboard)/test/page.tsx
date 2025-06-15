"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { SignIn } from "../sign-in";

export default function TestPage() {
  const data = useQuery(api.data.getSubmissions);

  return (
    <div>
      <SignIn />
      {JSON.stringify(data)}
    </div>
  );
}
