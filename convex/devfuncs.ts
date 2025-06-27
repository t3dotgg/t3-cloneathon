import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

export const importSubmissions = internalMutation({
  args: {
    submissions: v.array(v.any()),
  },
  returns: v.array(v.id("submissions")),
  handler: async (ctx, args) => {
    const insertedIds = [];

    for (const submission of args.submissions) {
      delete submission._id;
      delete submission._creationTime;

      const id = await ctx.db.insert("submissions", submission);
      insertedIds.push(id);
    }

    return insertedIds;
  },
});
