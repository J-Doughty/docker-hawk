import CloseIcon from "@mui/icons-material/Close";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { DataGrid, GridRenderCellParams } from "@mui/x-data-grid";

import { useExpandTableRow } from "./hooks/useExpandTableRow";
import { useManageTableColumns } from "./hooks/useMangeTableColumns";
import { useTableFilters } from "./hooks/useTableFilters";
import FilterPanel, { FilterPanelProps } from "./filterPanel";
import TableToolbar, { TableToolbarProps } from "./tableToolbar";
import {
  ColumnDefinition,
  ColumnsToHideAtBreakpoint,
  FilterDefinition,
  InferColumnFields,
  RowData,
} from "./types";

import "./expandableTable.css";

declare module "@mui/x-data-grid" {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface FilterPanelPropsOverrides extends FilterPanelProps<string> { }

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface ToolbarPropsOverrides extends TableToolbarProps { }
}

function ExpandableTable<T extends string>({
  columns,
  rows,
  columnsToHide,
  filterDefinitions,
}: {
  columns: ColumnDefinition<T>[];
  rows: RowData<InferColumnFields<typeof columns>>[];
  columnsToHide?: ColumnsToHideAtBreakpoint<InferColumnFields<typeof columns>>;
  filterDefinitions?: FilterDefinition<InferColumnFields<typeof columns>>[];
}) {
  type ColumnFields = InferColumnFields<typeof columns>;

  const { expandedRow, expandRow, collapseRow } = useExpandTableRow();
  const {
    filterValues,
    setFilterValues,
    filteredRowData,
    selectFilterOptions,
  } = useTableFilters({
    filterDefinitions: filterDefinitions ?? [],
    rows,
  });

  const { onColumnVisibilityModelChange, computedVisibility } =
    useManageTableColumns({
      columns: columns ?? [],
      columnsToHide: columnsToHide ?? {},
    });

  // TODO should be using actions for this? https://mui.com/x/react-data-grid/column-definition/
  columns = [
    {
      field: "expand",
      headerName: "",
      width: 50,
      sortable: false,
      cellClassName: "p-0",
      hideable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams<RowData<ColumnFields>>) => (
        <div className="flex-column align-center justify-center h-100 w-100">
          <Button
            variant="text"
            className="h-100 w-100"
            onClick={() => expandRow(params.row)}
          >
            <OpenInFullIcon />
          </Button>
        </div>
      ),
    },
    ...columns,
  ];

  const filterPanelProps: FilterPanelProps<ColumnFields> = {
    filterValues,
    setFilterValues,
    filterDefinitions,
    selectOptions: selectFilterOptions,
  };

  return (
    <div style={{ maxHeight: "100%", width: "100%", overflow: "auto" }}>
      <DataGrid
        rows={filteredRowData}
        columns={columns}
        hideFooter
        columnVisibilityModel={computedVisibility}
        onColumnVisibilityModelChange={onColumnVisibilityModelChange}
        disableColumnMenu
        // TODO On the toolbar, overriden reset columns so that it clears user defined columns
        // and sets the columns for the breakpoint
        showToolbar
        disableDensitySelector
        slots={{ toolbar: TableToolbar, filterPanel: FilterPanel }}
        slotProps={{
          toolbar: {
            showFiltersButton:
              filterDefinitions !== undefined &&
              filterDefinitions?.length !== 0,
          },
          filterPanel: filterPanelProps,
        }}
      />

      {/* Expandable rows in a data grid is a Pro feature so implement this popout draw for now */}
      {/* The premium model also supports grouping rows which may be useful for compose project */}
      <Drawer anchor="right" open={expandedRow !== null} onClose={collapseRow}>
        <Box sx={{ width: 300, p: 2 }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6">{expandedRow?.expanded.title}</Typography>
            <IconButton onClick={collapseRow}>
              <CloseIcon />
            </IconButton>
          </Box>
          {expandedRow && <Box mt={2}>{expandedRow.expanded.body}</Box>}
        </Box>
      </Drawer>
    </div>
  );
}

export default ExpandableTable;
