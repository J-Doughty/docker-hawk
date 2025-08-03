import { NoArgCallback } from "../../../../types/frontend/functions/functionTypes";

export interface ActionIconProps {
  containerName?: string;
  key: number;
  refreshData: NoArgCallback;
  isDisabled?: boolean;
}
