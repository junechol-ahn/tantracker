import authMiddleware from '@/authMiddleware';
import { asc, desc, eq } from 'drizzle-orm';
import { createServerFn } from '@tanstack/react-start';
import { db } from '..';
import { transactionsTable } from '../schema';

export const getTransactionYearsRange = createServerFn()
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const today = new Date();
    const [earliestTransaction] = await db
      .select()
      .from(transactionsTable)
      .where(eq(transactionsTable.userId, context.userId))
      .orderBy(asc(transactionsTable.transactionDate))
      .limit(1);

    const currentYear = today.getFullYear();
    const earliestYear = earliestTransaction
      ? new Date(earliestTransaction.transactionDate).getFullYear()
      : currentYear;

    const years = Array.from({ length: currentYear - earliestYear + 1 }).map(
      (_, i) => {
        return currentYear - i;
      },
    );

    return years
  });
