import { ComponentProps } from "react";

import { OverridableComponent } from "@mui/material/OverridableComponent";
import SvgIcon, { SvgIconTypeMap } from "@mui/material/SvgIcon";
import { GridActionsCellItem } from "@mui/x-data-grid";

function ActionItem({
  Icon,
  label,
  onClick,
  isDisabled = false,
  key,
  colour,
}: {
  Icon: OverridableComponent<SvgIconTypeMap<unknown, "svg">>;
  label: string;
  onClick: () => void;
  isDisabled?: boolean;
  key: number;
  colour?: ComponentProps<typeof SvgIcon>["color"];
}) {
  return (
    <GridActionsCellItem
      key={key}
      style={{
        boxShadow: "none",
      }}
      disabled={isDisabled}
      icon={
        <Icon
          sx={(theme) => ({
            ...(isDisabled ? { color: theme.palette.action.disabled } : {}),
          })}
          color={colour}
        />
      }
      onClick={onClick}
      label={label}
    />
  );
}

export default ActionItem;
