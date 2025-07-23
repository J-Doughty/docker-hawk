import { ReactNode, useMemo, useState } from "react";

import CloseIcon from "@mui/icons-material/Close";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import {
  ColumnsPanelTrigger,
  DataGrid,
  FilterPanelTrigger,
  GridColDef,
  GridColumnVisibilityModel,
  GridFilterPanel,
  GridRenderCellParams,
  Toolbar,
  ToolbarButton,
} from "@mui/x-data-grid";
import { useForm, SubmitHandler } from "react-hook-form"

import { useBreakpoints } from "../../../hooks/useBreakpoints";

import "./expandableTable.css";
import Tooltip from "@mui/material/Tooltip";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import FilterListIcon from "@mui/icons-material/FilterList";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";

// These types were created partially from https://github.com/mui/mui-x/issues/4623
type ColumnField<T extends string> = T | "expand";

type ColumnDefinition<T extends string> = GridColDef & {
  field: ColumnField<T>;
};

type RowDefinition<T extends string> = Record<
  T,
  string | number | null | undefined
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

function CustomToolbar() {
  return (
    <Toolbar>
      <Tooltip title="Columns">
        <ColumnsPanelTrigger render={<ToolbarButton />}>
          <ViewColumnIcon fontSize="small" />
        </ColumnsPanelTrigger>
      </Tooltip>
      <Tooltip title="Filters">
        <FilterPanelTrigger render={<ToolbarButton />}>
          <FilterListIcon fontSize="small" />
        </FilterPanelTrigger>
      </Tooltip>
    </Toolbar>
  );
}


function CustomFilterPanel() {
  type FormValues = { showStopped?: boolean, composeProject?: string }
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>()
  const onSubmit: SubmitHandler<FormValues> = (data) => console.log(data)

  return (
    <div style={{ padding: "1em 2em" }}>
      <h3 style={{ padding: 0, marginTop: 0 }}>Filters</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormGroup className="flex-column" style={{ gap: "1em" }}>
          <FormControlLabel control={<Switch defaultChecked />} label="Show stopped containers" />
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Age</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Age"
            >
              <MenuItem value={10}>Ten</MenuItem>
              <MenuItem value={20}>Twenty</MenuItem>
              <MenuItem value={30}>Thirty</MenuItem>
            </Select>
          </FormControl>
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
}: {
  columns: ColumnDefinition<T>[];
  rows: RowDefinition<T>[];
  columnsToHide?: ColumnsToHideAtBreakpoint<T>;
}) {
  const screenBreakpoint = useBreakpoints();
  const [userSetColumns, setUserSetColumns] =
    useState<GridColumnVisibilityModel>({});
  const [selectedRow, setSelectedRow] = useState<RowDefinition<T> | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

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

  return (
    <div style={{ maxHeight: "100%", width: "100%", overflow: "auto" }}>
      <DataGrid
        rows={rows}
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
        slots={{ toolbar: CustomToolbar, filterPanel: CustomFilterPanel }}
      // slotProps={{
      //   toolbar: {
      //     printOptions: { disableToolbarButton: true },
      //     csvOptions: { disableToolbarButton: true },
      //   },
      // }}
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

