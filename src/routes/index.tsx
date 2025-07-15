import { createFileRoute } from "@tanstack/react-router";

import Home from "../components/pages/home/home";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Home />;
}
