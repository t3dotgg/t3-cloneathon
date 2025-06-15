"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

export default function TestPage() {
  const data = useQuery(api.data.getSubmissions);

  return <div>{JSON.stringify(data)}</div>;
}
