import { query } from "./_generated/server";

export const getSubmissions = query({
  args: {},
  handler: async (ctx) => {
    const submissions = await ctx.db.query("submissions").take(100);
    return submissions;
  },
});
