import { useMemo, useState } from "react";

import CloseIcon from "@mui/icons-material/Close";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import {
  DataGrid,
  GridColumnVisibilityModel,
  GridRenderCellParams,
} from "@mui/x-data-grid";

import { useBreakpoints } from "../../../hooks/useBreakpoints";

import { useTableFilters } from "./hooks/useTableFilters";
import FilterPanel, { FilterPanelProps } from "./filterPanel";
import TableToolbar, { TableToolbarProps } from "./tableToolbar";
import {
  ColumnDefinition,
  ColumnField,
  FilterDefinition,
  RowDefinition,
} from "./types";

import "./expandableTable.css";
import { useExpandTableRow } from "./hooks/useExpandTableRow";

// TODO T should be defined from the column values only

interface ColumnsToHideAtBreakpoint<T extends string> {
  xs?: ColumnField<T>[];
  sm?: ColumnField<T>[];
  md?: ColumnField<T>[];
  lg?: ColumnField<T>[];
  xl?: ColumnField<T>[];
}

declare module "@mui/x-data-grid" {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface FilterPanelPropsOverrides extends FilterPanelProps<string> { }

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface ToolbarPropsOverrides extends TableToolbarProps { }
}

const getDefaultHiddenColumns = <T extends string>(
  columns: ColumnDefinition<T>[],
  breakpoints: ReturnType<typeof useBreakpoints>,
  columnsToHide?: ColumnsToHideAtBreakpoint<T>,
) => {
  const { isXs, isSm, isMd, isLg, isXl } = breakpoints;
  const hiddenColumns = columns.filter(
    (column) =>
      (isXl && columnsToHide?.xl?.includes(column.field)) ||
      (isLg && columnsToHide?.lg?.includes(column.field)) ||
      (isMd && columnsToHide?.md?.includes(column.field)) ||
      (isSm && columnsToHide?.sm?.includes(column.field)) ||
      (isXs && columnsToHide?.xs?.includes(column.field)),
  );

  const columnVisibilityModel: GridColumnVisibilityModel = {};
  for (const hiddenColumn of hiddenColumns) {
    columnVisibilityModel[hiddenColumn.field] = false;
  }

  return columnVisibilityModel;
};

function ExpandableTable<T extends string>({
  columns,
  rows,
  columnsToHide,
  filterDefinitions,
}: {
  columns: ColumnDefinition<T>[];
  rows: RowDefinition<T>[];
  columnsToHide?: ColumnsToHideAtBreakpoint<T>;
  filterDefinitions?: FilterDefinition<T>[];
}) {
  const screenBreakpoint = useBreakpoints();

  const [userSetColumns, setUserSetColumns] =
    useState<GridColumnVisibilityModel>({});

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

  columns = [
    {
      field: "expand",
      headerName: "",
      width: 50,
      sortable: false,
      cellClassName: "p-0",
      hideable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams<RowDefinition<T>>) => (
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

  const computedVisibility = useMemo(() => {
    const columnVisibility: GridColumnVisibilityModel = {};
    // TODO memoize this call
    const defaultColumnVisibilityModel = getDefaultHiddenColumns(
      columns,
      screenBreakpoint,
      columnsToHide,
    );

    for (const column of columns) {
      const visibilitySetByUser: boolean | undefined =
        userSetColumns[column.field];

      if (visibilitySetByUser !== undefined) {
        columnVisibility[column.field] = visibilitySetByUser;
      } else {
        columnVisibility[column.field] =
          defaultColumnVisibilityModel[column.field] ?? true;
      }
    }

    return columnVisibility;
  }, [screenBreakpoint, userSetColumns]);

  const updateUserSetColumns = (visibilityModel: GridColumnVisibilityModel) => {
    setUserSetColumns((prev) => {
      const userUpdatedVisibilityModel: GridColumnVisibilityModel = { ...prev };

      for (const column of Object.keys(visibilityModel)) {
        // If something changed then the user has modified the visibility of that column
        if (computedVisibility[column] !== visibilityModel[column]) {
          userUpdatedVisibilityModel[column] = visibilityModel[column];
        }
      }

      // This is a specical case where they've clicked to show/hide all columns
      const hideableColumnNames = columns
        .filter((col) => col.hideable !== false)
        .map((col) => col.field);

      if (
        Object.keys(visibilityModel).filter((column) =>
          hideableColumnNames.includes(column as T),
        ).length === 0
      ) {
        const previousValueNotSet = Object.keys(prev).length === 0;
        const allColumnsHidden = Object.values(prev).reduce(
          (acc, colShown) => acc || colShown,
          false,
        );

        for (const column of hideableColumnNames) {
          userUpdatedVisibilityModel[column] =
            !previousValueNotSet && !allColumnsHidden;
        }
      }

      return userUpdatedVisibilityModel;
    });
  };

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
        onColumnVisibilityModelChange={(visibilityModel) =>
          updateUserSetColumns(visibilityModel)
        }
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
