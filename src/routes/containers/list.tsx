import { createFileRoute } from "@tanstack/react-router";

import ContainerList from "../../components/pages/containerList/containerList";

export const Route = createFileRoute("/containers/list")({
  component: RouteComponent,
});

function RouteComponent() {
  return <ContainerList />;
}
