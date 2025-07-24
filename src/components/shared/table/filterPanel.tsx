import { useEffect } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";

import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Switch from "@mui/material/Switch";

import { FilterDefinition, FilterForm, RowValue } from "./types";

export interface FilterPanelProps<T extends string> {
  filterValues: FilterForm;
  setFilterValues: React.Dispatch<React.SetStateAction<FilterForm>>;
  filterDefinitions: FilterDefinition<T>[] | undefined;
  selectOptions: Partial<Record<T, Set<RowValue>>>;
}

function FilterPanel<T extends string>({
  filterValues,
  setFilterValues,
  filterDefinitions,
  selectOptions,
}: FilterPanelProps<T>) {
  const { control } = useForm<typeof filterValues>({
    values: filterValues,
  });
  const watchForm = useWatch({ control });

  useEffect(() => {
    setFilterValues(watchForm);
  }, [watchForm]);

  return (
    <div style={{ padding: "1em 2em", maxHeight: "calc(100vh - 200px)" }}>
      <h3 style={{ padding: 0, marginTop: 0 }}>Filters</h3>
      <form>
        <FormGroup className="flex-column" style={{ gap: "1em" }}>
          {filterDefinitions?.map((filterDefinition) => (
            <Controller
              key={filterDefinition.name}
              control={control}
              name={filterDefinition.name}
              render={({ field }) =>
                (filterDefinition.type === "toggle" ? (
                  <FormControlLabel
                    control={
                      <Switch
                        checked={(field.value as boolean | undefined) ?? false}
                        onChange={field.onChange}
                      />
                    }
                    label={filterDefinition.label}
                    {...field}
                  />
                ) : (
                  <FormControl fullWidth>
                    <InputLabel id="compose-project-select-label">
                      Compose project
                    </InputLabel>
                    <Select label={filterDefinition.label} {...field}>
                      <MenuItem value="">&nbsp;</MenuItem>
                      {Array.from(selectOptions[filterDefinition.field] ?? [])
                        .filter(
                          (option) => option !== null || option !== undefined,
                        )
                        .map((option) => (
                          <MenuItem key={option} value={option?.toString()}>
                            {option}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                ))
              }
            />
          ))}
        </FormGroup>
      </form>
    </div>
  );
}

export default FilterPanel;
