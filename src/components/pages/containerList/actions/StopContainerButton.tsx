import StopIcon from "@mui/icons-material/Stop";
import { invoke } from "@tauri-apps/api/core";

import ActionItem from "../../../shared/table/actionItem";

import { ActionIconProps } from "./types";

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

export default StopContainerButton;
