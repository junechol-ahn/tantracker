import { createFileRoute, Outlet } from '@tanstack/react-router';
import { RecentTransactions } from '../-components/recent-transactions';
import { getRecentTransactions } from '@/db/queries/getRecentTransactions';
import { getAnnualCashflow } from '@/db/queries/getAnnualCashflow';
import { getTransactionYearsRange } from '@/db/queries/getTransactionYearsRange';
import { Cashflow } from '../-components/cashflow';
import z from 'zod';
import { isToday } from 'date-fns';
import LoadingSkeleton from '../-components/loading-skeleton';

const today = new Date();

const searchSchema = z.object({
  cfyear: z
    .number()
    .min(today.getFullYear() - 100)
    .max(today.getFullYear())
    .catch(today.getFullYear()),
});

export const Route = createFileRoute('/_authed/dashboard')({
  pendingComponent: () => (
    <div className="max-w-7xl mx-auto py-5">
      <h1 className="text-4xl font-semibold pb-5">Dashboard</h1>
      <LoadingSkeleton />
    </div>
  ),
  validateSearch: searchSchema,
  component: RouteComponent,
  loaderDeps: ({ search }) => ({ cfyear: search.cfyear }),
  loader: async ({ deps }) => {
    const [transactions, cashflow, years] = await Promise.all([
      getRecentTransactions(),
      getAnnualCashflow({ data: { year: deps.cfyear ?? today.getFullYear() } }),
      getTransactionYearsRange(),
    ]);

    return {
      cfyear: deps.cfyear,
      transactions,
      cashflow,
      years,
    };
  },
});

function RouteComponent() {
  const { transactions, cashflow, years, cfyear } = Route.useLoaderData();
  console.log(cashflow);
  console.log(years);
  return (
    <div className="max-w-7xl mx-auto py-5">
      <h1 className="text-4xl font-semibold pb-5">Dashboard</h1>
      <Cashflow years={years} cfyear={cfyear} annualCashflow={cashflow} />
      <RecentTransactions transactions={transactions} />
    </div>
  );
}
