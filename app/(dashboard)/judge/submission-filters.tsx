"use client";

interface SubmissionFiltersProps {
  filters: {
    status: "in-progress" | "submitted" | undefined;
    reviewed: boolean | undefined;
    goodSubmission: boolean | undefined;
  };
  onFiltersChange: (filters: any) => void;
}

export function SubmissionFilters({
  filters,
  onFiltersChange,
}: SubmissionFiltersProps) {
  const updateFilter = (key: string, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      status: undefined,
      reviewed: undefined,
      goodSubmission: undefined,
    });
  };

  const hasActiveFilters =
    filters.status ||
    filters.reviewed !== undefined ||
    filters.goodSubmission !== undefined;

  return (
    <div className="bg-muted/50 rounded-lg p-4 mb-6">
      <div className="flex flex-wrap items-center gap-4">
        <h3 className="text-sm font-medium text-foreground">Filters:</h3>

        <div className="flex items-center gap-2">
          <label
            htmlFor="status-filter"
            className="text-sm text-muted-foreground"
          >
            Status:
          </label>
          <select
            id="status-filter"
            value={filters.status || ""}
            onChange={(e) =>
              updateFilter("status", e.target.value || undefined)
            }
            className="text-sm border border-border rounded px-2 py-1 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">All</option>
            <option value="in-progress">In Progress</option>
            <option value="submitted">Submitted</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label
            htmlFor="reviewed-filter"
            className="text-sm text-muted-foreground"
          >
            Reviewed:
          </label>
          <select
            id="reviewed-filter"
            value={
              filters.reviewed === undefined ? "" : filters.reviewed.toString()
            }
            onChange={(e) => {
              const value = e.target.value;
              updateFilter(
                "reviewed",
                value === "" ? undefined : value === "true"
              );
            }}
            className="text-sm border border-border rounded px-2 py-1 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">All</option>
            <option value="true">Reviewed</option>
            <option value="false">Not Reviewed</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label
            htmlFor="good-filter"
            className="text-sm text-muted-foreground"
          >
            Good Submission:
          </label>
          <select
            id="good-filter"
            value={
              filters.goodSubmission === undefined
                ? ""
                : filters.goodSubmission.toString()
            }
            onChange={(e) => {
              const value = e.target.value;
              updateFilter(
                "goodSubmission",
                value === "" ? undefined : value === "true"
              );
            }}
            className="text-sm border border-border rounded px-2 py-1 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">All</option>
            <option value="true">Good Submissions</option>
            <option value="false">Not Good</option>
          </select>
        </div>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-primary hover:text-primary/80 underline"
          >
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );
}
