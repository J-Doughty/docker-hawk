import { ReactNode } from "react";

import { GridColDef } from "@mui/x-data-grid";

export type RowValue = string | number | null | undefined;

type FilterType = "toggle" | "select";

export type FilterFormValue = string | boolean | undefined;

export type FilterForm = Record<string, FilterFormValue>;

export type AdditionalDataBase = Record<string, unknown>;

export type FilterPredicate<
  T extends string,
  U extends AdditionalDataBase,
  V,
> = (rowData: RowData<T, U>, filterValue: V) => boolean;

interface FilterDefinitionBase<
  T extends string,
  U extends AdditionalDataBase,
  V,
> {
  predicate: FilterPredicate<T, U, V>;
  type: FilterType;
  name: string;
  label: string;
  default: V;
}

interface ToggleFilter<T extends string, U extends AdditionalDataBase>
  extends FilterDefinitionBase<T, U, boolean> {
  type: "toggle";
}

interface SelectFilter<T extends string, U extends AdditionalDataBase>
  extends FilterDefinitionBase<T, U, string> {
  // TODO you might want to supply your own values for a dropdown instead of using the field
  field: T;
  type: "select";
}

export type FilterDefinition<T extends string, U extends AdditionalDataBase> =
  | ToggleFilter<T, U>
  | SelectFilter<T, U>;

// These types were created partially from https://github.com/mui/mui-x/issues/4623
export type ColumnDefinition<T extends string> = GridColDef & {
  field: T;
};

export type RowData<T extends string, U extends AdditionalDataBase> = Record<
  T,
  RowValue
> & {
  id: number | string;
  expanded: {
    title: string;
    body: ReactNode;
  };
  additionalData: U;
};

export interface ColumnsToHideAtBreakpoint<T extends string> {
  xs?: T[];
  sm?: T[];
  md?: T[];
  lg?: T[];
  xl?: T[];
}
