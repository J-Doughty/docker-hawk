import { useEffect, useState } from "react";

import DeleteIcon from "@mui/icons-material/Delete";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopIcon from "@mui/icons-material/Stop";
import Typography from "@mui/material/Typography";
import { createFileRoute } from "@tanstack/react-router";
import { invoke } from "@tauri-apps/api/core";

import PrimaryPageLayout from "../../components/shared/layout/primaryPageLayout";
import ActionItem from "../../components/shared/table/actionItem";
import ExpandableTable from "../../components/shared/table/expandableTable";
import {
  ContainerSummary,
  ContainerSummaryStateEnum,
} from "../../types/tauri/commands/docker/ContainerSummary";

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
                predicate: (rowData, filterValue) =>
                  filterValue === true || rowData.additionalData.isRunning,
                type: "toggle",
                name: "showStoppedContainers",
                label: "Show stopped containers",
                default: true,
              },
              {
                field: "composeProject",
                predicate: (rowData, filterValue) =>
                  (filterValue ? filterValue === rowData.composeProject : true),
                type: "select",
                name: "composeProject",
                label: "Show stopped containers",
                default: "",
              },
            ]}
            actions={{
              actionsWidth: 100,
              getCustomActions: (params) => {
                const isContainerRunning = params.row.additionalData.isRunning;

                return [
                  <ActionItem
                    key={2}
                    Icon={!isContainerRunning ? PlayArrowIcon : StopIcon}
                    onClick={() => true}
                    label={isContainerRunning ? "Stop" : "Start"}
                    colour={isContainerRunning ? "#3f8cb5" : "#b5a33f"}
                  />,
                  <ActionItem
                    key={3}
                    Icon={DeleteIcon}
                    onClick={() => true}
                    label="Delete"
                    colour="#db4b57"
                    isDisabled={params.row.additionalData.isRunning}
                  />,
                ];
              },
            }}
            columnsToHide={{
              xs: ["image", "state", "containerId", "status"],
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
              additionalData: {
                isRunning:
                  container.State === ContainerSummaryStateEnum.RUNNING,
              },
            }))}
          />
        )}
      </section>
    </PrimaryPageLayout>
  );
}
