import { useState } from "react";

import { AdditionalDataBase, RowData } from "../types";

export const useExpandTableRow = <
  T extends string,
  U extends AdditionalDataBase,
>() => {
  const [expandedRow, setExpandedRow] = useState<RowData<T, U> | null>(null);

  const expandRow = (row: RowData<T, U>) => {
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
