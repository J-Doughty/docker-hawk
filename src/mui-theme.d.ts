import { Theme } from "@mui/material/styles"

declare module "@mui/material/styles" {
    interface ColorSystemOptions {
        custom: {
            scrollbar: {
                track: string;
                thumb: string;
                thumbSelected: string;
            }
        }
    }

    interface ColorSystem {
        custom: {
            scrollbar: {
                track: string;
                thumb: string;
                thumbSelected: string;
            }
        }
    }
}