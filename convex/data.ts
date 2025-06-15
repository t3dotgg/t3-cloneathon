import { query } from "./_generated/server";

export const getSubmissions = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Not authenticated");
    }

    console.log(identity);
    const submissions = await ctx.db.query("submissions").take(100);
    return submissions;
  },
});
