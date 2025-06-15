import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createOrUpdateSubmission = mutation({
  args: {
    submission: v.object({
      projectName: v.string(),
      members: v.array(v.string()),

      githubUrl: v.string(),
      hostedSiteUrl: v.optional(v.string()),
      videoOverviewUrl: v.optional(v.string()),

      description: v.optional(v.string()),
      favoriteParts: v.optional(v.string()),

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
      .first();

    if (submission) {
      await ctx.db.patch(submission._id, {
        ...args.submission,
        updatedAt: Date.now(),
      });
    } else {
      await ctx.db.insert("submissions", {
        ...args.submission,
        userId: identity.subject,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    }
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
      .filter((q) => q.eq(q.field("userId"), identity.subject))
      .first();
  },
});
