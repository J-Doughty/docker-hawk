import DeleteIcon from "@mui/icons-material/Delete";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopIcon from "@mui/icons-material/Stop";
import Typography from "@mui/material/Typography";
import { invoke } from "@tauri-apps/api/core";

import { ContainerSummaryStateEnum } from "../../../types/tauri/commands/docker/containerSummary";
import ActionItem from "../../shared/table/actionItem";
import ExpandableTable from "../../shared/table/expandableTable";
import {
  ColumnDefinition,
  ColumnsToHideAtBreakpoint,
  FilterDefinition,
} from "../../shared/table/types";

import { DockerContainerSummary } from "./containerList";

interface ActionIconProps {
  containerName?: string;
  key: number;
}

function StartContainerButton({ containerName, key }: ActionIconProps) {
  return (
    <ActionItem
      key={key}
      Icon={PlayArrowIcon}
      onClick={() => invoke("start_container", { containerName }).then()}
      label={"Start"}
      colour={"#3f8cb5"}
      isDisabled={containerName === undefined}
    />
  );
}

function StopContainerButton({ containerName, key }: ActionIconProps) {
  return (
    <ActionItem
      key={key}
      Icon={StopIcon}
      onClick={() => invoke("stop_container", { containerName }).then()}
      label={"Stop"}
      colour={"#b5a33f"}
      isDisabled={containerName === undefined}
    />
  );
}

type ContainerTableColumnFields =
  | "name"
  | "containerId"
  | "image"
  | "state"
  | "status"
  | "composeProject";

interface AdditionalContainerData extends Record<string, unknown> {
  isRunning: boolean;
}

function ContainerTable({
  containers,
}: {
  containers: DockerContainerSummary[];
}) {
  const columnDefinitions: ColumnDefinition<ContainerTableColumnFields>[] = [
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
  ];

  const columnsToHideAtBreakpoint: ColumnsToHideAtBreakpoint<ContainerTableColumnFields> =
    {
      xs: ["image", "state", "containerId", "status"],
      sm: ["image", "state"],
    };

  const filters: FilterDefinition<
    ContainerTableColumnFields,
    AdditionalContainerData
  >[] = [
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
  ];

  return (
    <ExpandableTable
      columns={columnDefinitions}
      columnsToHide={columnsToHideAtBreakpoint}
      filterDefinitions={filters}
      actions={{
        actionsWidth: 100,
        getCustomActions: (params) => {
          const isContainerRunning = params.row.additionalData.isRunning;

          return [
            isContainerRunning ? (
              <StopContainerButton
                containerName={params.row.name?.toString()}
                key={2}
              />
            ) : (
              <StartContainerButton
                containerName={params.row.name?.toString()}
                key={2}
              />
            ),
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
      rows={containers.map((container) => ({
        id: container.key,
        name: container.name,
        containerId: container.Id?.slice(0, 11),
        image: container.Image,
        state: container.State,
        status: container.Status,
        composeProject: container.composeProject ?? "-",
        expanded: {
          title: "Container details",
          body: (
            <Typography>
              <strong>Name:</strong> {container.name}
            </Typography>
          ),
        },
        additionalData: {
          isRunning: container.State === ContainerSummaryStateEnum.RUNNING,
        },
      }))}
    />
  );
}

export default ContainerTable;
