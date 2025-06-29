"use client";

import { useUser } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import { usePaginatedQuery, useQuery } from "convex/react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SubmissionCard } from "./submission-card";
import { SubmissionFilters } from "./submission-filters";

export default function JudgePage() {
  const { user } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();

  const submissionCounts = useQuery(api.submission.getSubmissionCounts);

  // Initialize filters from URL query parameters
  const [filters, setFilters] = useState({
    status:
      (searchParams.get("status") as "in-progress" | "submitted" | null) ||
      undefined,
    reviewed:
      searchParams.get("reviewed") === "true"
        ? true
        : searchParams.get("reviewed") === "false"
          ? false
          : undefined,
    score: searchParams.get("score")
      ? (parseInt(searchParams.get("score")!) as
          | 1
          | 2
          | 3
          | 4
          | 5
          | 6
          | 7
          | 8
          | 9
          | 10)
      : undefined,
  });

  // Update URL when filters change
  const handleFiltersChange = (newFilters: typeof filters) => {
    setFilters(newFilters);

    const params = new URLSearchParams();

    if (newFilters.status) {
      params.set("status", newFilters.status);
    }

    if (newFilters.reviewed !== undefined) {
      params.set("reviewed", newFilters.reviewed.toString());
    }

    if (newFilters.score !== undefined) {
      params.set("score", newFilters.score.toString());
    }

    const queryString = params.toString();
    const newUrl = queryString ? `?${queryString}` : "/judge";

    router.replace(newUrl, { scroll: false });
  };

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
    <div className="w-[80rem] max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Submission Judging
          </h1>
          <p className="text-muted-foreground">
            Review and evaluate all competition submissions.
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground mb-1">Reviewed</p>
          <p className="text-2xl font-bold text-foreground">
            {submissionCounts?.reviewed ?? "-"}/
            {submissionCounts?.submitted ?? "-"}
          </p>
        </div>
      </div>

      <SubmissionFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
      />

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
