import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { paginationOptsValidator } from "convex/server";

async function requireAdmin(ctx: any) {
  const identity = await ctx.auth.getUserIdentity();
  if (identity === null) {
    throw new Error("Not authenticated");
  }

  // Check if user has admin role in Clerk metadata
  const isAdmin = identity?.public_metadata?.role === "admin";
  if (!isAdmin) {
    throw new Error("Admin access required");
  }

  return identity;
}

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

export const getAllSubmissions = query({
  args: {
    paginationOpts: paginationOptsValidator,
    filter: v.optional(
      v.object({
        status: v.optional(
          v.union(v.literal("in-progress"), v.literal("submitted"))
        ),
        reviewed: v.optional(v.boolean()),
        goodSubmission: v.optional(v.boolean()),
      })
    ),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    let query = ctx.db.query("submissions");

    // Apply filters sequentially
    if (args.filter?.status !== undefined) {
      query = query.filter((q) => q.eq(q.field("status"), args.filter!.status));
    }
    if (args.filter?.reviewed !== undefined) {
      query = query.filter((q) => {
        if (args.filter!.reviewed) {
          return q.eq(q.field("reviewed"), true);
        } else {
          return q.or(
            q.eq(q.field("reviewed"), false),
            q.eq(q.field("reviewed"), undefined)
          );
        }
      });
    }
    if (args.filter?.goodSubmission !== undefined) {
      query = query.filter((q) =>
        q.eq(q.field("goodSubmission"), args.filter!.goodSubmission)
      );
    }

    // Apply pagination
    return await query.paginate(args.paginationOpts);
  },
});

export const updateSubmissionJudging = mutation({
  args: {
    submissionId: v.id("submissions"),
    updates: v.object({
      reviewed: v.optional(v.boolean()),
      goodSubmission: v.optional(v.boolean()),
      judgeNotes: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const submission = await ctx.db.get(args.submissionId);
    if (!submission) {
      throw new Error("Submission not found");
    }

    await ctx.db.patch(args.submissionId, {
      ...args.updates,
      updatedAt: Date.now(),
    });
  },
});
