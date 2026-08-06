import DeleteIcon from "@mui/icons-material/Delete";
import { Box, Typography } from "@mui/material";
import { invoke } from "@tauri-apps/api/core";

import CodeSnippet from "../../../shared/codeSnippet/codeSnippet";
import SimpleDialog from "../../../shared/modal/simpleDialog";
import ActionItem from "../../../shared/table/actionItem";

import { ActionIconProps } from "./types";

function DeleteContainerButton({
  containerName,
  refreshData,
  isDisabled,
  key,
}: ActionIconProps) {
  return (
    <SimpleDialog
      title={
        <>
          Delete <CodeSnippet>{containerName}</CodeSnippet>
        </>
      }
      content={
        <Box className="flex flex-col gap-4">
          <Typography>
            Are you sure you wish to delete{" "}
            <CodeSnippet>{containerName}</CodeSnippet>?
          </Typography>
          <Typography>This cannot be reversed!</Typography>
        </Box>
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

export default DeleteContainerButton;
