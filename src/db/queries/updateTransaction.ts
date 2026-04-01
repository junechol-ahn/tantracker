import { createServerFn } from '@tanstack/react-start';
import authMiddleware from '@/authMiddleware';
import z from 'zod';
import { addDays } from 'date-fns';
import { db } from '..';
import { transactionsTable } from '../schema';
import { and, eq } from 'drizzle-orm';

const schema = z.object({
  id: z.number(),
  categoryId: z.number().positive('Please select a category'),
  transactionDate: z.string().refine((value) => {
    const parsedDate = new Date(value);
    return !isNaN(parsedDate.getTime()) && parsedDate <= addDays(new Date(), 1);
  }),
  amount: z.number().positive('Amount must be greater than 0'),
  description: z
    .string()
    .min(3, 'Description must contain at least 3 characters')
    .max(300, 'Description must contain a maximum of 300 characters'),
});

export const updateTransaction = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .inputValidator((data: z.infer<typeof schema>) => schema.parse(data))
  .handler(async ({ data, context }) => {
    await db
      .update(transactionsTable)
      .set({
        amount: data.amount.toString(),
        description: data.description,
        categoryId: data.categoryId,
        transactionDate: data.transactionDate,
      })
      .where(
        and(
          eq(transactionsTable.id, data.id),
          eq(transactionsTable.userId, context.userId),
        ),
      );
  });
