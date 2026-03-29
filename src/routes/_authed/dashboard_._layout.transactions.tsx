import { createFileRoute, Outlet } from '@tanstack/react-router';
import z from 'zod';

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
});

function RouteComponent() {
  return <div>Hello "/_authed/dashboard/tranactions"!</div>;
}
