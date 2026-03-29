import { createFileRoute, Outlet } from '@tanstack/react-router';
import z from 'zod';
import { AllTransactions } from '../-components/all-transactions';
import { year } from 'drizzle-orm/mysql-core';

const today = new Date();

const searchSchema = z.object({
  month: z
    .number()
    .min(1)
    .max(12)
    .catch(today.getMonth() + 1)
    .default(today.getMonth() + 1),
  year: z
    .number()
    .min(today.getFullYear() - 100)
    .max(today.getFullYear())
    .catch(today.getFullYear())
    .default(today.getFullYear()),
});

export const Route = createFileRoute(
  '/_authed/dashboard_/_layout/transactions',
)({
  component: RouteComponent,
  validateSearch: searchSchema,
  loaderDeps: ({search}) =>{
    return{
      month: search.month,
      year: search.year,
    }
  },
  loader: async ({deps})=> {
    return {
      month: deps.month,
      year: deps.year,
    }
  },
});

function RouteComponent() {
  const {month, year} = Route.useLoaderData()
  return <AllTransactions month={month} year={year}/>
}
