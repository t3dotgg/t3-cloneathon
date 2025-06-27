"use client";

interface SubmissionFiltersProps {
  filters: {
    status: "in-progress" | "submitted" | undefined;
    reviewed: boolean | undefined;
    score: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | undefined;
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
      score: undefined,
    });
  };

  const hasActiveFilters =
    filters.status ||
    filters.reviewed !== undefined ||
    filters.score !== undefined;

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
            htmlFor="score-filter"
            className="text-sm text-muted-foreground"
          >
            Score:
          </label>
          <select
            id="score-filter"
            value={filters.score || ""}
            onChange={(e) => {
              const value = e.target.value;
              updateFilter("score", value === "" ? undefined : parseInt(value));
            }}
            className="text-sm border border-border rounded px-2 py-1 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">All Scores</option>
            <option value="1">Score 1</option>
            <option value="2">Score 2</option>
            <option value="3">Score 3</option>
            <option value="4">Score 4</option>
            <option value="5">Score 5</option>
            <option value="6">Score 6</option>
            <option value="7">Score 7</option>
            <option value="8">Score 8</option>
            <option value="9">Score 9</option>
            <option value="10">Score 10</option>
          </select>
        </div>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-muted-foreground hover:text-foreground underline"
          >
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );
}
