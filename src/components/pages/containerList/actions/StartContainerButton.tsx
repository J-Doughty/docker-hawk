import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { invoke } from "@tauri-apps/api/core";

import ActionItem from "../../../shared/table/actionItem";

import { ActionIconProps } from "./types";

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

export default StartContainerButton;
