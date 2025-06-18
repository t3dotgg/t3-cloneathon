import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const updateSubmission = mutation({
  args: {
    submission: v.object({
      projectName: v.string(),
      members: v.array(v.string()),

      githubUrl: v.string(),
      hostedSiteUrl: v.optional(v.string()),
      videoOverviewUrl: v.optional(v.string()),

      description: v.optional(v.string()),
      favoriteParts: v.optional(v.string()),
      biggestChallenges: v.optional(v.string()),
      testingInstructions: v.optional(v.string()),

      status: v.union(v.literal("in-progress"), v.literal("submitted")),
    }),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Not authenticated");
    }

    const submission = await ctx.db
      .query("submissions")
      .filter((q) => q.eq(q.field("userId"), identity.subject))
      .unique();

    if (!submission) {
      throw new Error("Submission not found");
    }

    await ctx.db.patch(submission._id, {
      ...args.submission,
      updatedAt: Date.now(),
    });
  },
});

export const getSubmission = query({
  args: {},
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Not authenticated");
    }

    return await ctx.db
      .query("submissions")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject))
      .unique();
  },
});
