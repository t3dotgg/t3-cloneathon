"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { useState, useCallback, useRef } from "react";

type Submission = {
  _id: Id<"submissions">;
  projectName: string;
  members: string[];
  githubUrl: string;
  hostedSiteUrl?: string;
  videoOverviewUrl?: string;
  description?: string;
  status: "in-progress" | "submitted";
  reviewed?: boolean;
  goodSubmission?: boolean;
  judgeNotes?: string;
  createdAt: number;
  updatedAt: number;
};

interface SubmissionCardProps {
  submission: Submission;
}

export function SubmissionCard({ submission }: SubmissionCardProps) {
  const updateJudging = useMutation(api.submission.updateSubmissionJudging);
  const [notes, setNotes] = useState(submission.judgeNotes || "");
  const [isUpdating, setIsUpdating] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedSaveNotes = useCallback(
    (value: string) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(async () => {
        try {
          setIsUpdating(true);
          await updateJudging({
            submissionId: submission._id,
            updates: { judgeNotes: value },
          });
        } catch (error) {
          console.error("Failed to save notes:", error);
        } finally {
          setIsUpdating(false);
        }
      }, 1000);
    },
    [submission._id, updateJudging]
  );

  const handleNotesChange = (value: string) => {
    setNotes(value);
    debouncedSaveNotes(value);
  };

  const handleToggle = async (field: "reviewed" | "goodSubmission") => {
    try {
      const currentValue = submission[field];
      await updateJudging({
        submissionId: submission._id,
        updates: { [field]: !currentValue },
      });
    } catch (error) {
      console.error(`Failed to update ${field}:`, error);
    }
  };

  const isYouTubeVideo = (url: string) => {
    return url.includes("youtube.com") || url.includes("youtu.be");
  };

  const getYouTubeEmbedUrl = (url: string) => {
    if (url.includes("youtu.be/")) {
      const videoId = url.split("youtu.be/")[1]?.split("?")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes("youtube.com/watch?v=")) {
      const videoId = url.split("v=")[1]?.split("&")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return url;
  };

  return (
    <div className="bg-card rounded-lg shadow-md border border-border p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            {submission.projectName}
          </h3>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>
              {submission.members.map((member, index) => (
                <span key={member}>
                  <a
                    href={`https://github.com/${member}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80 transition-colors underline"
                  >
                    {member}
                  </a>
                  {index < submission.members.length - 1 && ", "}
                </span>
              ))}
            </span>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                submission.status === "submitted"
                  ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                  : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
              }`}
            >
              {submission.status}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="flex items-center">
            <input
              type="checkbox"
              id={`reviewed-${submission._id}`}
              checked={submission.reviewed || false}
              onChange={() => handleToggle("reviewed")}
              className="h-4 w-4 text-primary focus:ring-primary border-border rounded"
            />
            <label
              htmlFor={`reviewed-${submission._id}`}
              className="ml-2 text-sm text-muted-foreground"
            >
              Reviewed
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id={`good-${submission._id}`}
              checked={submission.goodSubmission || false}
              onChange={() => handleToggle("goodSubmission")}
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-border rounded"
            />
            <label
              htmlFor={`good-${submission._id}`}
              className="ml-2 text-sm text-muted-foreground"
            >
              Good Submission
            </label>
          </div>
        </div>
      </div>

      {submission.description && (
        <div className="mb-4">
          <p className="text-foreground">{submission.description}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <a
          href={submission.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
              clipRule="evenodd"
            />
          </svg>
          GitHub Repository
        </a>

        {submission.hostedSiteUrl && (
          <a
            href={submission.hostedSiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
            Live Site
          </a>
        )}

        {submission.videoOverviewUrl && (
          <a
            href={submission.videoOverviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            Video Overview
          </a>
        )}
      </div>

      {submission.videoOverviewUrl &&
        isYouTubeVideo(submission.videoOverviewUrl) && (
          <div className="mb-6">
            <div className="aspect-video w-full">
              <iframe
                src={getYouTubeEmbedUrl(submission.videoOverviewUrl)}
                title="Video Overview"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full rounded-lg"
              ></iframe>
            </div>
          </div>
        )}

      <div className="mb-4">
        <label
          htmlFor={`notes-${submission._id}`}
          className="block text-sm font-medium text-foreground mb-2"
        >
          Judge Notes
          {isUpdating && (
            <span className="ml-2 text-xs text-muted-foreground">
              (saving...)
            </span>
          )}
        </label>
        <textarea
          id={`notes-${submission._id}`}
          value={notes}
          onChange={(e) => handleNotesChange(e.target.value)}
          rows={3}
          className="w-full border border-border rounded-md px-3 py-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="Add your judging notes here..."
        />
      </div>

      <div className="text-xs text-muted-foreground">
        Created: {new Date(submission.createdAt).toLocaleDateString()} |
        Updated: {new Date(submission.updatedAt).toLocaleDateString()}
      </div>
    </div>
  );
}
