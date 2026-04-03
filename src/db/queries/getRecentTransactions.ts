import authMiddleware from "@/authMiddleware";
import { createServerFn } from "@tanstack/react-start";
import { db } from "..";
import { transactionsTable, categoriesTable } from "../schema";
import { desc, eq } from "drizzle-orm";

export const getRecentTransactions = createServerFn()
  .middleware([authMiddleware])
  .handler(async ({context}) => {
    const transactions = await db.select({
        id: transactionsTable.id,
        description: transactionsTable.description,
        amount: transactionsTable.amount,
        transactionDate: transactionsTable.transactionDate,
        category: categoriesTable.name,
        transactionType: categoriesTable.type,
      })
      .from(transactionsTable)
      .where(eq(transactionsTable.userId, context.userId))
      .orderBy(desc(transactionsTable.transactionDate))
      .leftJoin(categoriesTable, eq(transactionsTable.categoryId, categoriesTable.id))
      .limit(5)
    return transactions
  })