import CssBaseline from "@mui/material/CssBaseline";
import {
  ColorSystemOptions,
  createTheme,
  ThemeProvider,
} from "@mui/material/styles";
import { createRouter, RouterProvider } from "@tanstack/react-router";

import { routeTree } from "./routeTree.gen";

import "./app.css";

const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const lightPalette: ColorSystemOptions = {
  palette: {
    mode: "light",
    primary: {
      main: "#3f51b5",
    },
    secondary: {
      main: "#f50057",
    },
  },
  custom: {
    scrollbar: {
      track: "#f1f1f1",
      thumb: "#c1c1c1",
      thumbSelected: "#a8a8a8",
    },
  },
};

const darkPalette: ColorSystemOptions = {
  palette: {
    mode: "dark",
    primary: {
      main: "#3f51b5",
    },
    secondary: {
      main: "#f50057",
    },
  },
  custom: {
    scrollbar: {
      track: "#2b2b2b",
      thumb: "#6b6b6b",
      thumbSelected: "#959595",
    },
  },
};

const appTheme = createTheme({
  colorSchemes: {
    dark: darkPalette,
    light: lightPalette,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: (theme) => {
        const track =
          theme.colorSchemes[theme.palette.mode]?.custom.scrollbar.track;
        const thumb =
          theme.colorSchemes[theme.palette.mode]?.custom.scrollbar.thumb;
        const thumbSelected =
          theme.colorSchemes[theme.palette.mode]?.custom.scrollbar
            .thumbSelected;

        return {
          body: {
            scrollbarColor: `${thumb} ${track}`,
            "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
              backgroundColor: track,
              width: "13px"
            },
            "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
              borderRadius: 8,
              backgroundColor: thumb,
              minHeight: 24,
              border: `3px solid ${track}`,
            },
            "&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus":
              {
                backgroundColor: thumbSelected,
              },
            "&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active":
              {
                backgroundColor: thumbSelected,
              },
            "&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover":
              {
                backgroundColor: thumbSelected,
              },
            "&::-webkit-scrollbar-corner, & *::-webkit-scrollbar-corner": {
              backgroundColor: thumb,
            },
          },
        };
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
