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
            {
              key: "name",
              displayName: "Name",
              width: { xs: "70%", sm: "50%", md: "25%" },
            },
            {
              key: "id",
              displayName: "Id",
              width: { md: "25%", lg: "200px" },
            },
            {
              key: "image",
              displayName: "Image",
              width: { md: "25%", lg: "180px" },
            },
            {
              key: "state",
              displayName: "State",
              width: { xs: "30%", sm: "25%", md: "100px" },
            },
            {
              key: "status",
              displayName: "Status",
              width: { sm: "25%", md: "25%", lg: "260px" },
            },
          ]}
          columnsToHide={{
            xs: ["id", "image", "status"],
            sm: ["id", "image"],
          }}
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
