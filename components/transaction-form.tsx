import { z } from 'zod';
import { useForm } from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod'

const transactionFormSchema = z.object({
  transactionType: z.enum(['income', 'expense']),
  categoryId: z.number().positive('Please select a category'),
  transactionDate: z
    .date()
    .max(new Date(), 'Transaction date cannot be in the future'),
  amount: z.number().positive('Amount must b e greater than 0'),
  description: z
    .string()
    .min(3, 'Description must contain at lease 3 characters')
    .max(300, 'Description must contain a maximun of 300 characters'),
});

export function TransactionForm() {
  const form = useForm<z.infer<typeof transactionFormSchema>>({
    resolver: zodResolver(transactionFormSchema)
  });

  const onSubmit = (data: z.infer<typeof transactionFormSchema>) => {
    console.log(data);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {/* 컴포넌트를 제어(Controlled)해야 하는 경우 (예: Custom Select, DatePicker 등) */}
      {/* Controller 또는 useController를 사용합니다. */}
      
      {/* 일반적인 Input의 경우 register를 바로 연결합니다. */}
      <div className="flex flex-col gap-2">
        <label htmlFor="amount" className="text-sm font-medium">
          Amount
        </label>
        <input 
          id="amount"
          type="number"
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors"
          {...form.register('amount', { valueAsNumber: true })}
        />
        {form.formState.errors.amount && (
          <p className="text-sm text-red-500">
            {form.formState.errors.amount.message}
          </p>
        )}
      </div>
      
      <div className="flex flex-col gap-2">
        <label htmlFor="description" className="text-sm font-medium">
          Description
        </label>
        <input 
          id="description"
          type="text"
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors"
          {...form.register('description')}
        />
        {form.formState.errors.description && (
          <p className="text-sm text-red-500">
            {form.formState.errors.description.message}
          </p>
        )}
      </div>

      <button 
        type="submit"
        className="inline-flex items-center justify-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white shadow"
      >
        Save Transaction
      </button>
    </form>
  );
}
