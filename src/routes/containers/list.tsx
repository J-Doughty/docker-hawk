import { useEffect, useState } from "react";

import Typography from "@mui/material/Typography";
import { createFileRoute } from "@tanstack/react-router";
import { invoke } from "@tauri-apps/api/core";

import PrimaryPageLayout from "../../components/shared/layout/primaryPageLayout";
import ExpandableTable from "../../components/shared/table/expandableTable";
import { ContainerSummary } from "../../types/tauri/commands/docker/ContainerSummary";

export const Route = createFileRoute("/containers/list")({
  component: RouteComponent,
});

interface DockerContainerSummary extends ContainerSummary {
  key: string;
  composeProject?: string;
}

function RouteComponent() {
  const [containers, setContainers] = useState<DockerContainerSummary[]>();

  useEffect(() => {
    invoke<ContainerSummary[]>("list_containers").then((dockerContainers) =>
      setContainers(
        dockerContainers.map((container) => ({
          ...container,
          key: container.Id ?? crypto.randomUUID(),
          // TODO map labels into their own object, possibly on the rust side
          composeProject: container.Labels?.["com.docker.compose.project"],
        })),
      ),
    );
  }, []);

  return (
    <PrimaryPageLayout>
      <h1>Containers</h1>
      <section className="h-100 overflow-hidden">
        {containers && (
          <ExpandableTable
            columns={[
              {
                field: "name",
                headerName: "Name",
                flex: 1,
              },
              {
                field: "containerId",
                headerName: "Id",
                flex: 1,
              },
              {
                field: "image",
                headerName: "Image",
                flex: 1,
              },
              {
                field: "state",
                headerName: "State",
                flex: 0.5,
              },
              {
                field: "status",
                headerName: "Status",
                flex: 1,
              },
              {
                field: "composeProject",
                headerName: "Compose project",
                flex: 1,
              },
            ]}
            filterDefinitions={[
              {
                field: "state",
                predicate: (filterValue, rowValue) =>
                  filterValue === true || rowValue === "running",
                type: "toggle",
                name: "showStoppedContainers",
                label: "Show stopped containers",
                default: true,
              },
              {
                field: "composeProject",
                predicate: (filterValue, rowValue) =>
                  (filterValue ? filterValue === rowValue : true),
                type: "select",
                name: "composeProject",
                label: "Show stopped containers",
                default: "",
              },
            ]}
            columnsToHide={{
              xs: ["image", "state", "containerId"],
              sm: ["image", "state"],
            }}
            rows={containers.map((container) => ({
              id: container.key,
              name: container.Names?.join(", "),
              containerId: container.Id?.slice(0, 11),
              image: container.Image,
              state: container.State,
              status: container.Status,
              composeProject: container.composeProject ?? "-",
              expanded: {
                title: "Container details",
                body: (
                  <Typography>
                    <strong>Name:</strong> {container.Names?.join(", ")}
                  </Typography>
                ),
              },
            }))}
          />
        )}
      </section>
    </PrimaryPageLayout>
  );
}
