import { createServerFn } from '@tanstack/react-start';
import authMiddleware from '@/authMiddleware';
import { z } from 'zod';
import { db } from '..';
import { transactionsTable } from '../schema';
import { and, eq } from 'drizzle-orm';

const schema = z.object({
  transactionId: z.number(),
});

export const getTransaction = createServerFn()
  .middleware([authMiddleware])
  .inputValidator((data: z.infer<typeof schema>) => schema.parse(data))
  .handler(async ({ data, context }) => {
    const [transaction] = await db
      .select()
      .from(transactionsTable)
      .where(
        and(
          eq(transactionsTable.id, data.transactionId),
          eq(transactionsTable.userId, context.userId),
        ),
      );
    return transaction
  });
