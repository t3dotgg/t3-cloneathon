"use client";

import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";

export default function Registration() {
  const currentSubmission = useQuery(api.submission.getSubmission);

  const submit = useMutation(api.submission.createOrUpdateSubmission);

  if (currentSubmission === undefined) {
    return <div>Loading...</div>;
  }

  if (currentSubmission === null) {
    return <div>No submission found</div>;
  }

  return (
    <div className="h-full bg-black flex items-center justify-center relative"></div>
  );
}
