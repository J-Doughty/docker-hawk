import { useTheme } from "@mui/material/styles";
import { Link, useMatchRoute } from "@tanstack/react-router";

import { FileRoutesByTo } from "../../../routeTree.gen";

interface ThemedLinkProps {
  to: keyof FileRoutesByTo;
  children: ((isActive: boolean) => React.ReactNode) | React.ReactNode;
}

function ThemedLink({ to, children }: ThemedLinkProps) {
  const theme = useTheme();
  const matchRoute = useMatchRoute();
  const isActive = !!matchRoute({ to });

  return (
    <Link to={to} style={{ color: theme.palette.primary.main }}>
      {typeof children === "function" ? children(isActive) : children}
    </Link>
  );
}

export default ThemedLink;
