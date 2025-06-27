"use client";

interface SubmissionFiltersProps {
  filters: {
    status: "in-progress" | "submitted" | undefined;
    reviewed: boolean | undefined;
    goodSubmission: boolean | undefined;
  };
  onFiltersChange: (filters: any) => void;
}

export function SubmissionFilters({ filters, onFiltersChange }: SubmissionFiltersProps) {
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

  const hasActiveFilters = filters.status || filters.reviewed !== undefined || filters.goodSubmission !== undefined;

  return (
    <div className="bg-gray-50 rounded-lg p-4 mb-6">
      <div className="flex flex-wrap items-center gap-4">
        <h3 className="text-sm font-medium text-gray-700">Filters:</h3>
        
        <div className="flex items-center gap-2">
          <label htmlFor="status-filter" className="text-sm text-gray-600">
            Status:
          </label>
          <select
            id="status-filter"
            value={filters.status || ""}
            onChange={(e) => updateFilter("status", e.target.value || undefined)}
            className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All</option>
            <option value="in-progress">In Progress</option>
            <option value="submitted">Submitted</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="reviewed-filter" className="text-sm text-gray-600">
            Reviewed:
          </label>
          <select
            id="reviewed-filter"
            value={filters.reviewed === undefined ? "" : filters.reviewed.toString()}
            onChange={(e) => {
              const value = e.target.value;
              updateFilter("reviewed", value === "" ? undefined : value === "true");
            }}
            className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All</option>
            <option value="true">Reviewed</option>
            <option value="false">Not Reviewed</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="good-filter" className="text-sm text-gray-600">
            Good Submission:
          </label>
          <select
            id="good-filter"
            value={filters.goodSubmission === undefined ? "" : filters.goodSubmission.toString()}
            onChange={(e) => {
              const value = e.target.value;
              updateFilter("goodSubmission", value === "" ? undefined : value === "true");
            }}
            className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All</option>
            <option value="true">Good Submissions</option>
            <option value="false">Not Good</option>
          </select>
        </div>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:text-blue-800 underline"
          >
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );
}