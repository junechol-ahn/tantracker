import { Button } from '@/components/ui/button'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div className="flex flex-wrap items-center gap-2 md:flex-row m-4">
    <Button variant="default">test button</Button>
  </div>
}
