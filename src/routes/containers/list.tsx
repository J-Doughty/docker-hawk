import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/containers/list')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/containers/list"!</div>
}
