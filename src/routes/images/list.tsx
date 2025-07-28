import { createFileRoute } from "@tanstack/react-router";

import ImageList from "../../../src/components/pages/imageList/imageList";

export const Route = createFileRoute("/images/list")({
  component: RouteComponent,
});

function RouteComponent() {
  return <ImageList />;
}
