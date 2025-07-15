import { useTheme } from "@mui/material/styles";
import { Link } from "@tanstack/react-router";

import { FileRoutesByTo } from "../../../routeTree.gen";

interface ThemedLinkProps {
  to: keyof FileRoutesByTo;
  children: React.ReactNode;
}

function ThemedLink({ to, children }: ThemedLinkProps) {
  const theme = useTheme();

  return (
    <Link to={to} style={{ color: theme.palette.primary.main }}>
      {children}
    </Link>
  );
}

export default ThemedLink;
