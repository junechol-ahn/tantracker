import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const transactionFormSchema = z.object({
  transactionType: z.enum(['income', 'expense']),
  categoryId: z.coerce.number().positive('Please select a category'),
  transactionDate: z.date(),
  amount: z.coerce.number().positive('Amount must be greater than 0'),
  description: z.string().min(3).max(300),
});

export function TransactionForm() {
  const form = useForm({
    resolver: zodResolver(transactionFormSchema)
  });

  return <div>Transaction Form</div>;
}
