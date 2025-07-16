
import { DataGrid, GridColDef } from "@mui/x-data-grid";

// These types were created partially from https://github.com/mui/mui-x/issues/4623
type ColumnDefinition<T extends string> = GridColDef & { field: T };

type RowDefinition<T extends string> = Record<
  T,
  string | number | null | undefined
> & {
  id: number | string;
};

function ExpandableTable<T extends string>({
  columns,
  rows,
}: {
  columns: ColumnDefinition<T>[];
  rows: RowDefinition<T>[];
}) {
  return (
    <div style={{ maxHeight: "100%", width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        hideFooter
      // density="compact"
      />
    </div>
  );
}

export default ExpandableTable;
