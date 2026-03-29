import {
  TransactionForm,
  transactionFormSchema,
} from '@/components/transaction-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createTransaction } from '@/data/createTransaction';
import { getCategories } from '@/data/getCategories';
import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router';
import { format } from 'date-fns';
import z, { date } from 'zod';
import { toast } from 'sonner';

export const Route = createFileRoute(
  '/_authed/dashboard_/_layout/transactions_/new',
)({
  component: RouteComponent,
  loader: async () => {
    const categories = await getCategories();
    return { categories };
  },
});

function RouteComponent() {
  const { categories } = Route.useLoaderData();
  const navigate = useNavigate();

  async function handleSubmit(
    data: z.infer<typeof transactionFormSchema>,
  ): Promise<void> {
    console.log('HANDLE SUBMIT:', data);
    const transaction = await createTransaction({
      data: {
        amount: data.amount,
        categoryId: data.categoryId,
        description: data.description,
        transactionDate: format(data.transactionDate, 'yyyy-MM-dd'),
      },
    });
    console.log(transaction);
    toast('Success', {
      description: 'Transaction created.',
      position: 'bottom-right',
    });
    navigate({
      to: '/dashboard/transactions',
      search: {
        month: data.transactionDate.getMonth() + 1,
        year: data.transactionDate.getFullYear(),
      },
    });
  }

  return (
    <Card className="max-w-3xl mt-4">
      <CardHeader>
        <CardTitle className="font-bold text-2xl">New Transaction</CardTitle>
      </CardHeader>
      <CardContent>
        <TransactionForm categories={categories} onSubmit={handleSubmit} />
      </CardContent>
    </Card>
  );
}
