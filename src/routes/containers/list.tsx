import { useEffect, useState } from "react";

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
}

function RouteComponent() {
  const [containers, setContainers] = useState<DockerContainerSummary[]>();

  useEffect(() => {
    invoke<ContainerSummary[]>("list_containers").then((dockerContainers) =>
      setContainers(
        dockerContainers.map((container) => ({
          ...container,
          key: container.Id ?? crypto.randomUUID(),
        })),
      ),
    );
  }, []);

  return (
    <PrimaryPageLayout>
      <h1>Containers</h1>
      <section>
        {containers && (
          <ExpandableTable
            columns={[
              {
                field: "name",
                headerName: "Name",
              },
              {
                field: "containerId",
                headerName: "Id",
              },
              {
                field: "image",
                headerName: "Image",
              },
              {
                field: "state",
                headerName: "State",
              },
              {
                field: "status",
                headerName: "Status",
              },
            ]}
            rows={containers.map((container) => ({
              id: Number(container.key),
              name: container.Names?.join(", "),
              containerId: container.Id?.slice(0, 11),
              image: container.Image,
              state: container.State,
              status: container.Status,
            }))}
          />
        )}
      </section>
    </PrimaryPageLayout>
  );
}
