import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createFileRoute } from '@tanstack/react-router'
import { TransactionForm } from '../-components/transaction-form';
import { getCategories } from '@/db/queries/getCategories';

export const Route = createFileRoute(
  '/_authed/dashboard_/_layout/transactions_/$transactionId',
)({
  component: RouteComponent,
  loader: async () => {
    const categories = await getCategories();
    return { categories };
  },
})

function RouteComponent() {
  const { categories } = Route.useLoaderData()
  const handleSubmit = async()=>{}
  return (
    <Card className="max-w-3xl mt-4">
      <CardHeader>
        <CardTitle className="font-bold text-2xl">Edit Transaction</CardTitle>
      </CardHeader>
      <CardContent>
        <TransactionForm categories={categories} onSubmit={handleSubmit} />
      </CardContent>
    </Card>
  );
}
