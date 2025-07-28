import { ReactNode } from "react";

import CloseIcon from "@mui/icons-material/Close";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import {
  DataGrid,
  GridActionsCellItemProps,
  GridRowParams,
} from "@mui/x-data-grid";

import { useExpandTableRow } from "./hooks/useExpandTableRow";
import { useManageTableColumns } from "./hooks/useMangeTableColumns";
import { useTableFilters } from "./hooks/useTableFilters";
import ActionItem from "./actionItem";
import FilterPanel, { FilterPanelProps } from "./filterPanel";
import TableToolbar, { TableToolbarProps } from "./tableToolbar";
import {
  AdditionalDataBase,
  ColumnDefinition,
  ColumnsToHideAtBreakpoint,
  FilterDefinition,
  RowData,
} from "./types";

import "./expandableTable.css";

declare module "@mui/x-data-grid" {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface FilterPanelPropsOverrides extends FilterPanelProps<string> {}

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface ToolbarPropsOverrides extends TableToolbarProps {}
}

// Exclude never to improve error messages, e.g
// if you add e.g columnsToHide={{ xs: ["notAColumn"] }}
// then the error is displayed under "columnsToHide" not "rows"
type InferColumnFields<T extends string> = Exclude<
  ColumnDefinition<T>[][number]["field"],
  never
>;

type CustomColumnField = "actions";

interface ActionsProps<T extends string, U extends AdditionalDataBase> {
  getCustomActions?: (params: GridRowParams<RowData<T, U>>) => ReactNode[];
  actionsWidth?: number;
}

interface ExpandableTableProps<T extends string, U extends AdditionalDataBase> {
  columns: ColumnDefinition<T>[];
  rows: RowData<InferColumnFields<T>, U>[];
  columnsToHide?: ColumnsToHideAtBreakpoint<InferColumnFields<T>>;
  filterDefinitions?: FilterDefinition<InferColumnFields<T>, U>[];
  actions?: ActionsProps<InferColumnFields<T>, U>;
}

function ExpandableTable<T extends string, U extends AdditionalDataBase>({
  columns,
  rows,
  columnsToHide,
  filterDefinitions,
  actions,
}: ExpandableTableProps<T, U>) {
  const defaultActionsWidth = 50;

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

  const columnDefinitions: ColumnDefinition<T | CustomColumnField>[] = [
    {
      field: "actions",
      type: "actions",
      width: actions?.actionsWidth ?? defaultActionsWidth,
      hideable: false,
      cellClassName: "actions-column",
      getActions: (params: GridRowParams<RowData<T, U>>) => [
        <ActionItem
          key={1}
          Icon={OpenInFullIcon}
          onClick={() => expandRow(params.row)}
          label="Expand"
        />,
        ...(actions?.getCustomActions
          ? (actions.getCustomActions(
              params,
            ) as readonly React.ReactElement<GridActionsCellItemProps>[])
          : []),
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
        columns={columnDefinitions}
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
