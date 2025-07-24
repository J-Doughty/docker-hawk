import { ReactNode } from "react";

import { GridColDef } from "@mui/x-data-grid";

export type RowValue = string | number | null | undefined;

type FilterType = "toggle" | "select";

export type FilterFormValue = string | boolean | undefined;

export type FilterForm = Record<string, FilterFormValue>;

export type FilterPredicate<T extends string, U> = (
  filterValue: U,
  rowData: RowData<T>,
) => boolean;

interface FilterDefinitionBase<T extends string, U> {
  predicate: FilterPredicate<T, U>;
  type: FilterType;
  name: string;
  label: string;
  default: U;
}

interface ToggleFilter<T extends string>
  extends FilterDefinitionBase<T, boolean> {
  type: "toggle";
}

interface SelectFilter<T extends string>
  extends FilterDefinitionBase<T, string> {
  // TODO you might want to supply your own values for a dropdown instead of using the field
  field: T;
  type: "select";
}

export type FilterDefinition<T extends string> =
  | ToggleFilter<T>
  | SelectFilter<T>;

// These types were created partially from https://github.com/mui/mui-x/issues/4623
type CustomColumnField = "expand";

export type ColumnField<T extends string> = T | CustomColumnField;

export type ColumnDefinition<T extends string> = GridColDef & {
  field: ColumnField<T>;
};

export type InferColumnFields<T extends ColumnDefinition<string>[]> = Exclude<
  T[number]["field"],
  CustomColumnField
>;

export type RowData<T extends string> = Record<T, RowValue> & {
  id: number | string;
  expanded: {
    title: string;
    body: ReactNode;
  };
};

export interface ColumnsToHideAtBreakpoint<T extends string> {
  xs?: ColumnField<T>[];
  sm?: ColumnField<T>[];
  md?: ColumnField<T>[];
  lg?: ColumnField<T>[];
  xl?: ColumnField<T>[];
}
