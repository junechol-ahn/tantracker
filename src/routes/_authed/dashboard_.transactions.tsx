import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/dashboard_/transactions')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>
    Hello "/_authed/dashboard/tranactions"!
  </div>
}
