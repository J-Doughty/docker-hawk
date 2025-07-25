import { OverridableComponent } from "@mui/material/OverridableComponent";
import { SvgIconTypeMap } from "@mui/material/SvgIcon";
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
  colour?: string;
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
            color: !isDisabled
              ? (colour ?? theme.palette.primary.main)
              : theme.palette.action.disabled,
          })}
        />
      }
      onClick={onClick}
      label={label}
    />
  );
}

export default ActionItem;
