import { ReactNode } from "react";

import { GridColDef } from "@mui/x-data-grid";

export type RowValue = string | number | null | undefined;

type FilterType = "toggle" | "select";

export type FilterFormValue = string | boolean | undefined;

export type FilterForm = Record<string, FilterFormValue>;

export type FilterPredicate<U> = (
  filterValue: U,
  rowValue: RowValue,
) => boolean;

interface FilterDefinitionBase<T, U> {
  // TODO i think we should pass in the full row instead of just the field on that row
  field: T;
  predicate: FilterPredicate<U>;
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
  type: "select";
}

export type FilterDefinition<T extends string> =
  | ToggleFilter<T>
  | SelectFilter<T>;

// These types were created partially from https://github.com/mui/mui-x/issues/4623
export type ColumnField<T extends string> = T | "expand";

export type ColumnDefinition<T extends string> = GridColDef & {
  field: ColumnField<T>;
  filter?: FilterDefinition<T>;
};

export type RowDefinition<T extends string> = Record<T, RowValue> & {
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
