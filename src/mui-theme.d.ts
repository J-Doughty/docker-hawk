// Imported for declaration merging purposes
// eslint-disable-next-line @typescript-eslint/no-unused-vars, unused-imports/no-unused-imports
import { Theme } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface ColorSystemOptions {
    custom: {
      scrollbar: {
        track: string;
        thumb: string;
        thumbSelected: string;
      };
    };
  }

  interface ColorSystem {
    custom: {
      scrollbar: {
        track: string;
        thumb: string;
        thumbSelected: string;
      };
    };
  }
}
