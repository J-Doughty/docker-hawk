import { ReactNode, useEffect, useMemo, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";

import CloseIcon from "@mui/icons-material/Close";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";
import {
  DataGrid,
  GridColDef,
  GridColumnVisibilityModel,
  GridRenderCellParams,
} from "@mui/x-data-grid";

import { useBreakpoints } from "../../../hooks/useBreakpoints";

import "./expandableTable.css";

type RowValue = string | number | null | undefined;

type FilterType = "toggle" | "select";

type FilterFormValue = string | boolean | undefined;

type FilterPredicate<U> = (filterValue: U, rowValue: RowValue) => boolean;

interface FilterDefinitionBase<T, U> {
  // TODO i think we should pass in the full row instead of just the field on that row
  field: T;
  predicate: FilterPredicate<U>;
  type: FilterType;
  name: string;
  label: string;
  default: U;
}

interface ToggleFilter<T extends string> extends FilterDefinitionBase<T, boolean> {
  type: "toggle";

}

interface SelectFilter<T extends string> extends FilterDefinitionBase<T, string> {
  type: "select";
}

type FilterDefinition<T extends string> = ToggleFilter<T> | SelectFilter<T>

// These types were created partially from https://github.com/mui/mui-x/issues/4623
type ColumnField<T extends string> = T | "expand";

type ColumnDefinition<T extends string> = GridColDef & {
  field: ColumnField<T>;
  filter?: FilterDefinition<T>
};

type RowDefinition<T extends string> = Record<
  T,
  RowValue
> & {
  id: number | string;
  expanded: {
    title: string;
    body: ReactNode;
  };
};

interface ColumnsToHideAtBreakpoint<T extends string> {
  xs?: ColumnField<T>[];
  sm?: ColumnField<T>[];
  md?: ColumnField<T>[];
  lg?: ColumnField<T>[];
  xl?: ColumnField<T>[];
}

interface FilterPanelProps<T extends string> {
  // TODO improve typing here
  filterValues: Record<string, FilterFormValue>;
  setFilterValues: React.Dispatch<
    React.SetStateAction<Record<string, FilterFormValue>>
  >;
  filterDefinitions: FilterDefinition<T>[] | undefined
  selectOptions: Partial<Record<T, Set<RowValue>>>;
}

declare module "@mui/x-data-grid" {
  interface FilterPanelPropsOverrides extends FilterPanelProps<string> { }
}


function CustomFilterPanel<T extends string>({ filterValues, setFilterValues, filterDefinitions, selectOptions }: FilterPanelProps<T>) {
  const { control } = useForm<typeof filterValues>({
    values: filterValues,
  });
  const watchForm = useWatch({ control });

  useEffect(() => {
    setFilterValues(watchForm);
  }, [watchForm]);

  return (
    <div style={{ padding: "1em 2em" }}>
      <h3 style={{ padding: 0, marginTop: 0 }}>Filters</h3>
      <form>
        <FormGroup className="flex-column" style={{ gap: "1em" }}>
          {
            // TODO dont show the button if theres no filterDefinitions
            filterDefinitions?.map(filterDefinition => (
              <Controller
                key={filterDefinition.name}
                control={control}
                name={filterDefinition.name}
                render={({ field }) => (
                  filterDefinition.type === "toggle" ? (
                    <FormControlLabel
                      control={
                        <Switch
                          checked={field.value as boolean | undefined ?? false}
                          onChange={field.onChange}
                        />
                      }
                      label={filterDefinition.label}
                      {...field}
                    />
                  ) : (
                    <FormControl fullWidth>
                      <InputLabel id="compose-project-select-label">
                        Compose project
                      </InputLabel>
                      <Select
                        label={filterDefinition.label}
                        {...field}
                      >
                        <MenuItem value="">&nbsp;</MenuItem>
                        {Array.from(selectOptions[filterDefinition.field] ?? []).filter(option => option !== null || option !== undefined).map(option => (
                          <MenuItem key={option} value={option?.toString()}>{option}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )
                )
                } />))}
        </FormGroup>
      </form>
    </div>
  );
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
  filterDefinitions
}: {
  columns: ColumnDefinition<T>[];
  rows: RowDefinition<T>[];
  columnsToHide?: ColumnsToHideAtBreakpoint<T>;
  filterDefinitions?: FilterDefinition<T>[];
}) {
  const screenBreakpoint = useBreakpoints();

  const [userSetColumns, setUserSetColumns] = useState<GridColumnVisibilityModel>({});
  const [selectedRow, setSelectedRow] = useState<RowDefinition<T> | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [filterValues, setFilterValues] = useState<Record<string, FilterFormValue>>(
    filterDefinitions?.reduce((acc, filter) => ({ ...acc, [filter.name]: filter.default }), {}) ?? {});

  const expandRow = (row: RowDefinition<T>) => {
    setSelectedRow(row);
    setDrawerOpen(true);
  };

  const collapseRow = () => {
    setDrawerOpen(false);
    setSelectedRow(null);
  };

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
    ...columns
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

  const getFilteredRowData = useMemo(() => {
    return filterDefinitions ? rows.filter(
      row => filterDefinitions.every(filter => (filter.predicate as FilterPredicate<FilterFormValue>)(filterValues[filter.name], row[filter.field]))
    ) : rows;
  }, [filterValues, rows])

  const getSelectFilterOptions = useMemo(() => {
    const selectFilterOptions: Partial<Record<T, Set<RowValue>>> = {};
    const columnsWithSelectFilter = filterDefinitions?.filter(filter => filter.type === "select").map(filter => filter.field) ?? []

    for (const column of columnsWithSelectFilter) {
      selectFilterOptions[column] = new Set(rows.map(row => row[column]));
    }

    return selectFilterOptions;
  }, [])

  const filterPanelProps: FilterPanelProps<T> = {
    filterValues,
    setFilterValues,
    filterDefinitions: filterDefinitions,
    selectOptions: getSelectFilterOptions,
  }

  return (
    <div style={{ maxHeight: "100%", width: "100%", overflow: "auto" }}>
      <DataGrid
        rows={getFilteredRowData}
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
        slots={{ filterPanel: CustomFilterPanel }}
        slotProps={{
          toolbar: {
            printOptions: { disableToolbarButton: true },
            csvOptions: { disableToolbarButton: true },
          },
          filterPanel: filterPanelProps
        }}
      />

      {/* Expandable rows in a data grid is a Pro feature so implement this popout draw for now */}
      {/* The premium model also supports grouping rows which may be useful for compose project */}
      <Drawer anchor="right" open={drawerOpen} onClose={collapseRow}>
        <Box sx={{ width: 300, p: 2 }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6">{selectedRow?.expanded.title}</Typography>
            <IconButton onClick={collapseRow}>
              <CloseIcon />
            </IconButton>
          </Box>
          {selectedRow && <Box mt={2}>{selectedRow.expanded.body}</Box>}
        </Box>
      </Drawer>
    </div>
  );
}

export default ExpandableTable;
