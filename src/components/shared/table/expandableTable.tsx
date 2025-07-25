import CloseIcon from "@mui/icons-material/Close";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { DataGrid, GridActionsCellItem, GridRowParams } from "@mui/x-data-grid";

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
  interface FilterPanelPropsOverrides extends FilterPanelProps<string> {}

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface ToolbarPropsOverrides extends TableToolbarProps {}
}

function ExpandableTable<T extends string>({
  columns,
  rows,
  columnsToHide,
  filterDefinitions,
}: {
  columns: ColumnDefinition<T>[];
  rows: RowData<T>[];
  columnsToHide?: ColumnsToHideAtBreakpoint<InferColumnFields<typeof columns>>;
  filterDefinitions?: FilterDefinition<InferColumnFields<typeof columns>>[];
}) {
  const { expandedRow, expandRow, collapseRow } = useExpandTableRow();
  const {
    filterValues,
    setFilterValues,
    filteredRowData,
    selectFilterOptions,
  } = useTableFilters<T>({
    filterDefinitions: filterDefinitions ?? [],
    rows,
  });

  const { onColumnVisibilityModelChange, computedVisibility } =
    useManageTableColumns({
      columns: columns ?? [],
      columnsToHide: columnsToHide ?? {},
    });

  columns = [
    {
      field: "expand",
      type: "actions",
      width: 50,
      cellClassName: "p-0",
      hideable: false,
      getActions: (params: GridRowParams<RowData<T>>) => [
        <GridActionsCellItem
          key={1}
          icon={
            <OpenInFullIcon
              sx={{
                color: "primary.main",
              }}
            />
          }
          onClick={() => expandRow(params.row)}
          label="Expand"
        />,
      ],
    },
    ...columns,
  ];

  const filterPanelProps: FilterPanelProps<T> = {
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
