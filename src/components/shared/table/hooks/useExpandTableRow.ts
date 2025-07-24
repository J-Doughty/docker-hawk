import { useState } from "react";

import { RowData } from "../types";

export const useExpandTableRow = <T extends string>() => {
  const [expandedRow, setExpandedRow] = useState<RowData<T> | null>(null);

  const expandRow = (row: RowData<T>) => {
    setExpandedRow(row);
  };

  const collapseRow = () => {
    setExpandedRow(null);
  };

  return {
    expandedRow,
    expandRow,
    collapseRow,
  };
};
