import { useCallback, useEffect, useState } from "react";

import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";

import { ContainerSummary } from "../../../types/tauri/commands/docker/ContainerSummary";
import PrimaryPageLayout from "../../shared/layout/primaryPageLayout";

import ContainersTable from "./containersTable";

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

const mapContainers = (
  containers: ContainerSummary[],
): DockerContainerSummary[] =>
  containers.map((container) => ({
    ...container,
    key: container.Id ?? crypto.randomUUID(),
    // TODO map labels into their own object, possibly on the rust side
    composeProject: container.Labels?.["com.docker.compose.project"],
    name: formatContainerName(container.Names),
  }));

function ContainerList() {
  const [containers, setContainers] = useState<
    DockerContainerSummary[] | undefined
  >();

  listen<DockerContainerSummary[]>("containers-updated", (event) => {
    setContainers(mapContainers(event.payload ?? []));
  });

  const getContainers = useCallback(async () => {
    // TODO extract these invoke functions out to a common file
    const dockerContainers = await invoke<ContainerSummary[] | undefined>(
      "list_containers",
    );

    setContainers(mapContainers(dockerContainers ?? []));
  }, []);

  useEffect(() => {
    getContainers();
  }, []);

  return (
    <PrimaryPageLayout>
      <h1>Containers</h1>
      <section className="h-100 overflow-hidden">
        {containers && (
          <ContainersTable
            containers={containers}
            refreshData={getContainers}
          />
        )}
      </section>
    </PrimaryPageLayout>
  );
}

export default ContainerList;
