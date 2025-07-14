import { createFileRoute } from "@tanstack/react-router";
import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";
import { ContainerSummary } from "../../types/tauri/commands/docker/ContainerSummary";
import ExpandableTable from "../../components/shared/table/expandableTable";

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
    <section>
      {containers && (
        <ExpandableTable
          columns={[
            { key: "name", displayName: "Name", width: { xs: "150px", sm: "200px", md: "100%" } },
            { key: "id", displayName: "Id", width: { xs: "80px", sm: "80px" } },
            { key: "image", displayName: "Image", width: { xs: "110px", md: "150px" } },
            { key: "state", displayName: "State", width: { xs: "110px" } },
            { key: "status", displayName: "Status", width: { xs: "110px", sm: "200px" } },
          ]}
          rows={containers.map((container) => ({
            key: container.key,
            rowValues: {
              name: container.Names?.join(", "),
              id: container.Id?.slice(0, 11),
              image: container.Image,
              state: container.State,
              status: container.Status,
            },
            expandablePanel: <>Expanded</>,
          }))}
        />
      )}
    </section>
  );
}
