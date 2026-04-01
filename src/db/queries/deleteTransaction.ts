import authMiddleware from "@/authMiddleware";
import { createServerFn } from "@tanstack/react-start";
import z from "zod";
import { db } from "..";
import { transactionsTable } from "../schema";
import { and, eq } from "drizzle-orm";

const schema = z.object({
  transactionId: z.number(),
})

export const deleteTransaction = createServerFn({method:'POST'})
  .middleware([authMiddleware])
  .inputValidator((data:z.infer<typeof schema>)=>schema.parse(data))
  .handler(async ({data, context}) => {
    await db.delete(transactionsTable)
      .where(and(
        eq(transactionsTable.id, data.transactionId),
        eq(transactionsTable.userId, context.userId)
      ))
  })