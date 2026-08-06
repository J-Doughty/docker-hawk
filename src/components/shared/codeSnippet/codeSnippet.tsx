import { ReactNode } from "react";

import { Box } from "@mui/material";

function CodeSnippet({ children }: { children: ReactNode }) {
  return <Box
    component="code"
    className="inline break-all rounded px-1.5 py-0.5 font-mono text-sm bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100"
  >
    {children}
  </Box>
}

export default CodeSnippet;
