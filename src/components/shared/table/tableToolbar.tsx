import FilterListIcon from "@mui/icons-material/FilterList";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import Tooltip from "@mui/material/Tooltip";
import {
  ColumnsPanelTrigger,
  FilterPanelTrigger,
  Toolbar,
  ToolbarButton,
  ToolbarButtonProps,
} from "@mui/x-data-grid";

import SearchPanel from "./searchPanel";
import { styled } from "@mui/material";

export interface TableToolbarProps {
  showFiltersButton: boolean;
}

const StyledToolbarButton = styled(
  ToolbarButton as React.ComponentType<ToolbarButtonProps>,
)({
  boxShadow: "none",
});

function TableToolbar({ showFiltersButton = true }: TableToolbarProps) {
  return (
    <Toolbar>
      <Tooltip title="Columns">
        <ColumnsPanelTrigger
          render={<StyledToolbarButton />}
        >
          <ViewColumnIcon fontSize="small" />
        </ColumnsPanelTrigger>
      </Tooltip>
      {showFiltersButton && (
        <Tooltip title="Filters">
          <FilterPanelTrigger
            render={<StyledToolbarButton />}
          >
            <FilterListIcon fontSize="small" />
          </FilterPanelTrigger>
        </Tooltip>
      )}

      <SearchPanel />
    </Toolbar>
  );
}

export default TableToolbar;
