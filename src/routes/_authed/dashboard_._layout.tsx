import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { createFileRoute, Link, Outlet, useLocation } from '@tanstack/react-router';

export const Route = createFileRoute('/_authed/dashboard_/_layout')({
  component: RouteComponent,
});

function RouteComponent() {
  const location = useLocation();
  const isTransactionsPage = location.pathname === '/dashboard/transactions';
  const isNewPage = location.pathname.endsWith('/new');
  const isTransactionDetailPage = /^\/dashboard\/transactions\/[^/]+$/.test(
    location.pathname,
  );

  return (
    <div className='flex justify-center '>
    <div className="max-w-7xl mx-auto py-10 w-full px-10">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/dashboard">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator></BreadcrumbSeparator>
          <BreadcrumbItem>
            {isTransactionsPage ? (
              <BreadcrumbPage>Transactions</BreadcrumbPage>
            ) : (
              <BreadcrumbLink asChild>
                <Link to="/dashboard/transactions">Transactions</Link>
              </BreadcrumbLink>
            )}
          </BreadcrumbItem>
          
          {(isNewPage || isTransactionDetailPage) && (
            <>
              <BreadcrumbSeparator></BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage>
                  {isNewPage ? 'New Transaction' : 'Edit Transaction'}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </>
          )}
        </BreadcrumbList>
      </Breadcrumb>
      <Outlet />
    </div>
    </div>
  );
}
