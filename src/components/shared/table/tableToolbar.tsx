import FilterListIcon from "@mui/icons-material/FilterList";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import Tooltip from "@mui/material/Tooltip";
import {
  ColumnsPanelTrigger,
  FilterPanelTrigger,
  Toolbar,
  ToolbarButton,
} from "@mui/x-data-grid";

import SearchPanel from "./searchPanel";

export interface TableToolbarProps {
  showFiltersButton: boolean;
}

function TableToolbar({ showFiltersButton = true }: TableToolbarProps) {
  return (
    <Toolbar>
      <Tooltip title="Columns">
        <ColumnsPanelTrigger render={<ToolbarButton />}>
          <ViewColumnIcon fontSize="small" />
        </ColumnsPanelTrigger>
      </Tooltip>
      {showFiltersButton && (
        <Tooltip title="Filters">
          <FilterPanelTrigger render={<ToolbarButton />}>
            <FilterListIcon fontSize="small" />
          </FilterPanelTrigger>
        </Tooltip>
      )}

      <SearchPanel />
    </Toolbar>
  );
}

export default TableToolbar;
