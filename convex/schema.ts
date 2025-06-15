import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  submissions: defineTable({
    projectName: v.string(),
    members: v.array(v.string()),

    userId: v.string(), // Subject from Clerk

    githubUrl: v.string(),
    hostedSiteUrl: v.optional(v.string()),
    videoOverviewUrl: v.optional(v.string()),

    description: v.optional(v.string()),
    favoriteParts: v.optional(v.string()),
    biggestChallenges: v.optional(v.string()),
    testingInstructions: v.optional(v.string()),

    createdAt: v.number(),
    updatedAt: v.number(),

    status: v.union(v.literal("in-progress"), v.literal("submitted")),
  }).index("by_user", ["userId"]),
});
