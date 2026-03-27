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
  const isNewPage = location.pathname.endsWith('/new');

  return (
    <div className="max-w-7xl mx-auto py-10">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/dashboard">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator></BreadcrumbSeparator>
          <BreadcrumbItem>
            {isNewPage ? (
              <BreadcrumbLink asChild>
                <Link to="/dashboard/transactions">Transactions</Link>
              </BreadcrumbLink>
            ) : (
              <BreadcrumbPage>Transactions</BreadcrumbPage>
            )}
          </BreadcrumbItem>
          
          {isNewPage && (
            <>
              <BreadcrumbSeparator></BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage>New Transaction</BreadcrumbPage>
              </BreadcrumbItem>
            </>
          )}
        </BreadcrumbList>
      </Breadcrumb>
      <Outlet />
    </div>
  );
}
