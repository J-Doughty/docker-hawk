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
type CustomColumnField = "expand" | "actions";

export type ColumnField<T extends string> = T | CustomColumnField;

export type ColumnDefinition<T extends string> = GridColDef & {
  field: ColumnField<T>;
};

export type InferColumnFields<T extends ColumnDefinition<string>[]> = Exclude<
  T[number]["field"],
  CustomColumnField
>;

type RowDataEntry<T extends string> = Record<T, RowValue> & {
  id: number | string;
  expanded: {
    title: string;
    body: ReactNode;
  };
};

type RowWithAddtionalData<
  T extends string,
  U extends AdditionalDataBase,
> = RowDataEntry<T> & {
  additionalData: U;
};

export type RowData<T extends string, U extends AdditionalDataBase> =
  | RowWithAddtionalData<T, U>
  | RowDataEntry<T>;

export interface ColumnsToHideAtBreakpoint<T extends string> {
  xs?: ColumnField<T>[];
  sm?: ColumnField<T>[];
  md?: ColumnField<T>[];
  lg?: ColumnField<T>[];
  xl?: ColumnField<T>[];
}
