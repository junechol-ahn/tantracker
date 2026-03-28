import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { addDays, format } from 'date-fns';
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
  FieldSet,
} from './ui/field';
import { Textarea } from './ui/textarea';
import { categoriesTable } from '@/db/schema';

export const transactionFormSchema = z.object({
  transactionType: z.enum(['income', 'expense']),
  categoryId: z.number().positive('Please select a category'),
  transactionDate: z
    .date()
    .max(addDays(new Date(), 1), 'Transaction date cannot be in the future'),
  amount: z.number().positive('Amount must be greater than 0'),
  description: z
    .string()
    .min(3, 'Description must contain at least 3 characters')
    .max(300, 'Description must contain a maximum of 300 characters'),
});

export function TransactionForm({
  categories,
  onSubmit
}: {
  categories: (typeof categoriesTable.$inferSelect)[],
  onSubmit: (data: z.infer<typeof transactionFormSchema>) => Promise<void>
}) {
  const form = useForm<z.infer<typeof transactionFormSchema>>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
      transactionType: 'expense',
      categoryId: 1,
      amount: 0,
      description: '',
      transactionDate: new Date()
    },
  });

  // const onSubmit = (data: z.infer<typeof transactionFormSchema>) => {
  //   console.log(data);
  // };

  const transactionType = form.watch('transactionType')
  const filteredCategories = categories.filter((cat)=> cat.type === transactionType)

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit, (errors) =>
        console.log('Validation errors:', errors),
      )}
      className="space-y-6 mb-4"
    >
      <FieldSet className="grid grid-cols-2 gap-y-5 gap-x-2">
        {/* Transaction Type (enum Select) */}
        <Controller
          control={form.control}
          name="transactionType"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Transaction Type</FieldLabel>

              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="transaction type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Category Id (enum Select) */}
        <Controller
          control={form.control}
          name="categoryId"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Category ID</FieldLabel>

              <Select onValueChange={(val) => field.onChange(Number(val))} value={field.value.toString()}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="transaction type" />
                </SelectTrigger>
                <SelectContent>
                  {filteredCategories.map((category)=>(
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Transaction Date (DatePicker) */}
        <Controller
          control={form.control}
          name="transactionDate"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Transaction Date</FieldLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !field.value && 'text-muted-foreground',
                    )}
                  >
                    <CalendarIcon className="mr-2 size-4" />
                    {field.value ? format(field.value, 'PPP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date > new Date()}
                  />
                </PopoverContent>
              </Popover>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Amount */}
        <Controller
          name="amount"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Amount</FieldLabel>

              <input
                id="amount"
                type="number"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors"
                {...form.register('amount', { valueAsNumber: true })}
              />

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Description */}
        <Controller
          name="description"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="col-span-2">
              <FieldLabel>Description</FieldLabel>

              <Textarea
                id="description"
                className="flex h-18 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors"
                {...form.register('description')}
              />

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      <Button type="submit" className="col-span-2">Save Transaction</Button>
      </FieldSet>
    </form>
  );
}
