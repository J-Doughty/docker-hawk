import { useMemo, useState } from "react";

import {
  FilterDefinition,
  FilterFormValue,
  FilterPredicate,
  RowDefinition,
  RowValue,
} from "../types";

const getFilterFormDefaults = <T extends string>(
  filterDefinitions: FilterDefinition<T>[],
) =>
  filterDefinitions?.reduce(
    (acc, filter) => ({ ...acc, [filter.name]: filter.default }),
    {},
  ) ?? {};

export const useTableFilters = <T extends string>({
  filterDefinitions,
  rows,
}: {
  filterDefinitions: FilterDefinition<T>[];
  rows: RowDefinition<T>[];
}) => {
  const setInitialFilterValues = useMemo(
    () => getFilterFormDefaults(filterDefinitions),
    [],
  );

  const [filterValues, setFilterValues] = useState<
    Record<string, FilterFormValue>
  >(setInitialFilterValues);

  const filteredRowData = useMemo(
    () =>
      (filterValues
        ? rows.filter((row) =>
            filterDefinitions.every((filter) =>
              (filter.predicate as FilterPredicate<FilterFormValue>)(
                filterValues[filter.name],
                row[filter.field],
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
