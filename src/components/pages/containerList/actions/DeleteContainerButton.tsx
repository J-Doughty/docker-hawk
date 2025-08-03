import DeleteIcon from "@mui/icons-material/Delete";
import { invoke } from "@tauri-apps/api/core";

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

export default DeleteContainerButton;
