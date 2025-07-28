import { useEffect, useState } from "react";

import { invoke } from "@tauri-apps/api/core";

import { ContainerSummary } from "../../../types/tauri/commands/docker/containerSummary";
import PrimaryPageLayout from "../../shared/layout/primaryPageLayout";

import ContainerTable from "./containerTable";

export interface DockerContainerSummary extends ContainerSummary {
  key: string;
  name?: string;
  composeProject?: string;
}

const formatContainerName = (names?: string[]) => {
  const primaryName = names?.[0];

  if (!primaryName) {
    return undefined;
  }

  return primaryName.charAt(0) === "/" ? primaryName.substring(1) : primaryName;
};

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
          name: formatContainerName(container.Names),
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
