import { useTheme } from "@mui/material/styles"
import useMediaQuery from "@mui/material/useMediaQuery";

export const useBreakpoints = () => {
    const theme = useTheme();

    const isXs = useMediaQuery(theme.breakpoints.only("xs"));
    const isSm = useMediaQuery(theme.breakpoints.only("sm"));
    const isMd = useMediaQuery(theme.breakpoints.only("md"));
    const isLg = useMediaQuery(theme.breakpoints.only("lg"));
    const isXl = useMediaQuery(theme.breakpoints.only("xl"));

    return {
        isXs, isSm, isMd, isLg, isXl
    };
}