import { useEffect, useState } from "react";

import { invoke } from "@tauri-apps/api/core";

import { ContainerSummary } from "../../../types/tauri/commands/docker/containerSummary";
import PrimaryPageLayout from "../../shared/layout/primaryPageLayout";

import ContainerTable from "./containerTable";

export interface DockerContainerSummary extends ContainerSummary {
  key: string;
  composeProject?: string;
}

function ContainerList() {
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
        {containers && <ContainerTable containers={containers} />}
      </section>
    </PrimaryPageLayout>
  );
}

export default ContainerList;
