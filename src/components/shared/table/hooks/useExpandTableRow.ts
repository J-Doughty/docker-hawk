import { useState } from "react";
import { RowDefinition } from "../types";

export const useExpandTableRow = <T extends string,>() => {
    const [expandedRow, setExpandedRow] = useState<RowDefinition<T> | null>(null);

    const expandRow = (row: RowDefinition<T>) => {
        setExpandedRow(row);
    };

    const collapseRow = () => {
        setExpandedRow(null);
    };

    return {
        expandedRow, expandRow, collapseRow
    }
}