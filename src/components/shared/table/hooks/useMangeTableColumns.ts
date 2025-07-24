import { useMemo, useState } from "react";

import { GridColumnVisibilityModel } from "@mui/x-data-grid";

import { useBreakpoints } from "../../../../hooks/useBreakpoints";
import { ColumnDefinition, ColumnsToHideAtBreakpoint } from "../types";

// Get the default hidden columns given the current breakppoint
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

export const useManageTableColumns = <T extends string>({
  columns,
  columnsToHide,
}: {
  columns: ColumnDefinition<T>[];
  columnsToHide: ColumnsToHideAtBreakpoint<T>;
}) => {
  const screenBreakpoint = useBreakpoints();

  const [userSetColumns, setUserSetColumns] =
    useState<GridColumnVisibilityModel>({});

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

  return {
    onColumnVisibilityModelChange: updateUserSetColumns,
    computedVisibility,
  };
};
