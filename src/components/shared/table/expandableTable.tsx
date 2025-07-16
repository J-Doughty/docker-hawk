import { DataGrid, GridColDef, GridColumnVisibilityModel } from "@mui/x-data-grid";
import { useBreakpoints } from "../../../hooks/useBreakpoints";
import { useMemo, useState } from "react";

// These types were created partially from https://github.com/mui/mui-x/issues/4623
type ColumnDefinition<T extends string> = GridColDef & { field: T };

type RowDefinition<T extends string> = Record<
  T,
  string | number | null | undefined
> & {
  id: number | string;
};

interface ColumnsToHideAtBreakpoint<T extends string> {
  xs?: T[];
  sm?: T[];
  md?: T[];
  lg?: T[];
  xl?: T[];
}

const getDefaultHiddenColumns = <T extends string,>(columns: ColumnDefinition<T>[], breakpoints: ReturnType<typeof useBreakpoints>, columnsToHide?: ColumnsToHideAtBreakpoint<T>) => {
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
}: {
  columns: ColumnDefinition<T>[];
  rows: RowDefinition<T>[];
  columnsToHide?: ColumnsToHideAtBreakpoint<T>;
}) {
  const screenBreakpoint = useBreakpoints();
  const [userSetColumns, setUserSetColumns] = useState<GridColumnVisibilityModel>({});

  const computedVisibility = useMemo(() => {
    const columnVisibility: GridColumnVisibilityModel = {};
    // TODO memoize this call
    const defaultColumnVisibilityModel = getDefaultHiddenColumns(columns, screenBreakpoint, columnsToHide);

    for (const column of columns) {
      const visibilitySetByUser: boolean | undefined = userSetColumns[column.field];

      if (visibilitySetByUser !== undefined) {
        columnVisibility[column.field] = visibilitySetByUser;
      } else {
        columnVisibility[column.field] = defaultColumnVisibilityModel[column.field] ?? true
      }
    }

    return columnVisibility;
  }, [screenBreakpoint, userSetColumns]);

  const updateUserSetColumns = (visibilityModel: GridColumnVisibilityModel) => {
    const userUpdatedVisibilityModel: GridColumnVisibilityModel = {}

    setUserSetColumns(() => {
      for (const column of Object.keys(visibilityModel)) {
        // If something changed then the user has modified the visibility of that column
        if (computedVisibility[column] !== visibilityModel[column]) {
          userUpdatedVisibilityModel[column] = visibilityModel[column]
        }
      }

      return userUpdatedVisibilityModel;
    });
  }

  return (
    <div style={{ maxHeight: "100%", width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        hideFooter
        columnVisibilityModel={computedVisibility}
        onColumnVisibilityModelChange={(visibilityModel) => updateUserSetColumns(visibilityModel)}
      // Density="compact"
      />
    </div>
  );
}

export default ExpandableTable;
