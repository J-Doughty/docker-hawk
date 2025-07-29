import DeleteIcon from "@mui/icons-material/Delete";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopIcon from "@mui/icons-material/Stop";
import Typography from "@mui/material/Typography";
import { invoke } from "@tauri-apps/api/core";

import { NoArgCallback } from "../../../types/frontend/functions/functionTypes";
import { ContainerSummaryStateEnum } from "../../../types/tauri/commands/docker/containerSummary";
import SimpleDialog from "../../shared/modal/simpleDialog";
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
  refreshData: NoArgCallback;
  isDisabled?: boolean;
}

function StartContainerButton({
  containerName,
  refreshData,
  key,
}: ActionIconProps) {
  return (
    <ActionItem
      key={key}
      Icon={PlayArrowIcon}
      onClick={async () => {
        await invoke("start_container", { containerName });
        refreshData();
      }}
      label={"Start"}
      colour="success"
      isDisabled={containerName === undefined}
    />
  );
}

function StopContainerButton({
  containerName,
  refreshData,
  key,
}: ActionIconProps) {
  return (
    <ActionItem
      key={key}
      Icon={StopIcon}
      onClick={async () => {
        await invoke("stop_container", { containerName });
        refreshData();
      }}
      label={"Stop"}
      colour="warning"
      isDisabled={containerName === undefined}
    />
  );
}

function DeleteContainerButton({
  containerName,
  refreshData,
  isDisabled,
  key,
}: ActionIconProps) {
  return (
    <SimpleDialog
      title={`Delete ${containerName}`}
      content={
        <div>
          Delete container: &quot;{containerName}&quot;? <br />
          <br />
          This action is not reversible.
        </div>
      }
      cancelText="Cancel"
      confirmText="Delete Container"
      onConfirm={async () => {
        await invoke("delete_container", { containerName });
        refreshData();
      }}
      renderTrigger={(openDialog) => (
        <ActionItem
          key={key}
          Icon={DeleteIcon}
          onClick={openDialog}
          label="Delete"
          colour="error"
          isDisabled={containerName === undefined || isDisabled}
        />
      )}
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

export default ContainerTable;
