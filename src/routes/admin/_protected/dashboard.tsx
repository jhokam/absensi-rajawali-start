import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/_protected/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/_protected/dashboard"!</div>
}
