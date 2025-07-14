import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import React from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

interface Width {
  xs?: string;
  sm?: string;
  md?: string;
  lg?: string;
}

interface ColumnDefinition<T extends string> {
  key: T;
  displayName: string | React.ReactNode;
  align?: "inherit" | "left" | "center" | "right" | "justify";
  width?: Width;
  minWidth?: string;
}

type ColumnKey<
  T extends string,
  U extends ColumnDefinition<T>[],
> = U[number]["key"];

// Record containg the values for the row, where keys are column names and values are
// the corresponding value
type RowValues<T extends string> = Record<
  ColumnKey<T, ColumnDefinition<T>[]>,
  string | number | undefined | null
>;

interface RowDefinition<T extends string> {
  key: string;
  rowValues: RowValues<T>;
  expandablePanel: React.ReactNode;
}

const EXPAND_BUTTON_WIDTH = 60;

function Row<T extends string>({
  columns,
  row,
}: {
  columns: ColumnDefinition<T>[];
  row: RowDefinition<T>;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        {columns.map((column) => (
          <TableCell
            key={`${column.key}-${row.key}`}
            align={column.align}
            component="td"
            scope="row"
            sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
          >
            {row.rowValues[column.key]}
          </TableCell>
        ))}
      </TableRow>
      <TableRow>
        {/* Disable the border when the panel is not open to stop stacking borders */}
        <TableCell
          sx={!open ? { border: "none" } : {}}
          style={{ paddingBottom: 0, paddingTop: 0 }}
          colSpan={6}
        >
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>{row.expandablePanel}</Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

function ExpandableTable<T extends string>({
  columns,
  rows,
}: {
  columns: ColumnDefinition<T>[];
  rows: RowDefinition<T>[];
}) {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table" sx={{ tableLayout: "fixed" }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: `${EXPAND_BUTTON_WIDTH}px` }} />
            {columns.map((column) => (
              <TableCell key={column.key} align={column.align} sx={{
                width: {
                  xs: column.width?.xs,
                  sm: column.width?.sm,
                  md: column.width?.md,
                  lg: column.width?.lg,
                },
                overflow: "hidden", textOverflow: "ellipsis"
              }}>
                {column.displayName}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <Row key={row.key} columns={columns} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default ExpandableTable;
