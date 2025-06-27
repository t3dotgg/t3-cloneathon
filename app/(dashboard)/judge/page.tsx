"use client";

import { useUser } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import { usePaginatedQuery } from "convex/react";
import { useState, useEffect } from "react";
import { SubmissionCard } from "./submission-card";
import { SubmissionFilters } from "./submission-filters";

export default function JudgePage() {
  const { user } = useUser();
  const [filters, setFilters] = useState({
    status: undefined as "in-progress" | "submitted" | undefined,
    reviewed: undefined as boolean | undefined,
    goodSubmission: undefined as boolean | undefined,
  });

  // Check if user is admin
  const isAdmin = user?.publicMetadata?.role === "admin";

  const {
    results: submissions,
    status,
    loadMore,
  } = usePaginatedQuery(
    api.submission.getAllSubmissions,
    { filter: filters },
    { initialNumItems: 10 }
  );

  // Redirect if not admin
  useEffect(() => {
    if (user && !isAdmin) {
      window.location.href = "/register";
    }
  }, [user, isAdmin]);

  if (!user || !isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Access Denied
          </h1>
          <p className="text-muted-foreground">
            You need admin privileges to access this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Submission Judging
        </h1>
        <p className="text-muted-foreground">
          Review and evaluate all competition submissions.
        </p>
      </div>

      <SubmissionFilters filters={filters} onFiltersChange={setFilters} />

      {status === "LoadingFirstPage" ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {submissions?.map((submission) => (
            <SubmissionCard key={submission._id} submission={submission} />
          ))}

          {submissions?.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No submissions found.</p>
            </div>
          )}

          {status === "CanLoadMore" && (
            <div className="flex justify-center py-6">
              <button
                onClick={() => loadMore(10)}
                className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
              >
                Load More
              </button>
            </div>
          )}

          {status === "LoadingMore" && (
            <div className="flex justify-center py-6">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
