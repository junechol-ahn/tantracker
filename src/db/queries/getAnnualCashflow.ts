import authMiddleware from "@/authMiddleware";
import { createServerFn } from "@tanstack/react-start";
import z, { number } from "zod";
import { db } from "..";
import { and, eq, sql } from "drizzle-orm";
import { categoriesTable, transactionsTable } from "../schema";

const schema = z.object({
  year: z.number(),
})

export const getAnnualCashflow = createServerFn()
  .middleware([authMiddleware])
  .inputValidator((data: z.infer<typeof schema>) => schema.parse(data))
  .handler(async ({context, data}) => {
    const cashflow = await db.select({
        month: sql<string>`EXTRACT (MONTH FROM ${transactionsTable.transactionDate})`,
        totalIncome: sql<string>`SUM(CASE WHEN ${categoriesTable.type} = 'income' THEN ${transactionsTable.amount} ELSE 0 END)`,
        totalExpenses: sql<string>`SUM(CASE WHEN ${categoriesTable.type} = 'expense' THEN ${transactionsTable.amount} ELSE 0 END)`
      })
      .from(transactionsTable)
      .leftJoin(categoriesTable, eq(transactionsTable.categoryId, categoriesTable.id))
      .where(and(
        eq(transactionsTable.userId, context.userId),
        sql`EXTRACT(YEAR FROM ${transactionsTable.transactionDate}) = ${data.year}`))
      .groupBy(sql`EXTRACT(MONTH FROM ${transactionsTable.transactionDate})`)
      .orderBy(sql`EXTRACT(MONTH FROM ${transactionsTable.transactionDate})`)

    const annualCashflow: {
      month: number,
      income: number,
      expense: number,
    }[] = []

    for (let i=1; i<=12; i++) {
      const monthlyCashflow = cashflow.find((cf)=>Number(cf.month)===i)
      annualCashflow.push({
        month: i,
        income: Number(monthlyCashflow?.totalIncome ?? 0),
        expense: Number(monthlyCashflow?.totalExpenses ?? 0),
      })
    }
    return annualCashflow
  })