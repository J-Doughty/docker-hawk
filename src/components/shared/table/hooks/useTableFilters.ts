import { useMemo, useState } from "react";

import {
  AdditionalDataBase,
  FilterDefinition,
  FilterForm,
  FilterFormValue,
  FilterPredicate,
  RowData,
  RowValue,
} from "../types";

const getFilterFormDefaults = <T extends string, U extends AdditionalDataBase>(
  filterDefinitions: FilterDefinition<T, U>[],
) =>
  filterDefinitions?.reduce(
    (acc, filter) => ({ ...acc, [filter.name]: filter.default }),
    {},
  ) ?? {};

export const useTableFilters = <
  T extends string,
  U extends AdditionalDataBase,
>({
  filterDefinitions,
  rows,
}: {
  filterDefinitions: FilterDefinition<T, U>[];
  rows: RowData<T, U>[];
}) => {
  const setInitialFilterValues = useMemo(
    () => getFilterFormDefaults(filterDefinitions),
    [],
  );

  const [filterValues, setFilterValues] = useState<FilterForm>(
    setInitialFilterValues,
  );

  const filteredRowData = useMemo(
    () =>
      (filterValues
        ? rows.filter((row) =>
            filterDefinitions.every((filter) =>
              (filter.predicate as FilterPredicate<T, U, FilterFormValue>)(
                row,
                filterValues[filter.name],
              ),
            ),
          )
        : rows),
    [filterValues, rows, filterDefinitions],
  );

  const selectFilterOptions = useMemo(() => {
    const selectColumnUniqueOptions: Partial<Record<T, Set<RowValue>>> = {};
    const columnsWithSelectFilter =
      filterDefinitions
        ?.filter((filter) => filter.type === "select")
        .map((filter) => filter.field) ?? [];

    for (const column of columnsWithSelectFilter) {
      selectColumnUniqueOptions[column] = new Set(
        rows.map((row) => row[column]),
      );
    }

    return selectColumnUniqueOptions;
  }, []);

  return {
    filterValues,
    setFilterValues,
    filteredRowData,
    selectFilterOptions,
  };
};
