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
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

interface ColumnDefinition<T extends string> {
    key: T;
    displayName: string | React.ReactNode;
    align?: 'inherit' | 'left' | 'center' | 'right' | 'justify';
}

type ColumnKey<T extends string, U extends ColumnDefinition<T>[]> = U[number]["key"]

type RowValues<T extends string> = Record<ColumnKey<T, ColumnDefinition<T>[]>, string | number | undefined | null>

interface RowDefinition<T extends string> {
    rowValues: RowValues<T>;
    expandablePanel: React.ReactNode;
}

function Row<T extends string>({ columns, rowValues, expandedPanel }: { columns: ColumnDefinition<T>[], rowValues: RowValues<T>, expandedPanel: React.ReactNode }) {
    const [open, setOpen] = React.useState(false);

    return (
        <React.Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                {columns.map(column => (
                    <TableCell align={column.align} component="td" scope="row">
                        {rowValues[column.key]}
                    </TableCell>
                ))}
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            {expandedPanel}
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

function ExpandableTable<T extends string>({ columns, rows }: { columns: ColumnDefinition<T>[], rows: RowDefinition<T>[] }) {
    return (
        <TableContainer component={Paper}>
            <Table aria-label="collapsible table">
                <TableHead>
                    <TableRow>
                        <TableCell />
                        {columns.map(
                            column => (<TableCell align={column.align}>{column.displayName}</TableCell>)
                        )}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <Row columns={columns} rowValues={row.rowValues} expandedPanel={row.expandablePanel} />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default ExpandableTable;