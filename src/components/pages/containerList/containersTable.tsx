import Typography from "@mui/material/Typography";

import { NoArgCallback } from "../../../types/frontend/functions/functionTypes";
import { ContainerSummaryStateEnum } from "../../../types/tauri/commands/docker/containerSummary";
import ExpandableTable from "../../shared/table/expandableTable";
import {
  ColumnDefinition,
  ColumnsToHideAtBreakpoint,
  FilterDefinition,
} from "../../shared/table/types";

import DeleteContainerButton from "./actions/DeleteContainerButton";
import StartContainerButton from "./actions/StartContainerButton";
import StopContainerButton from "./actions/StopContainerButton";
import { DockerContainerSummary } from "./containerList";

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

function ContainersTable({
  containers,
  refreshData,
}: {
  containers: DockerContainerSummary[];
  refreshData: NoArgCallback;
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
                refreshData={refreshData}
                key={2}
              />
            ) : (
              <StartContainerButton
                containerName={params.row.name?.toString()}
                refreshData={refreshData}
                key={2}
              />
            ),
            <DeleteContainerButton
              containerName={params.row.name?.toString()}
              refreshData={refreshData}
              isDisabled={params.row.additionalData.isRunning}
              key={3}
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

export default ContainersTable;
