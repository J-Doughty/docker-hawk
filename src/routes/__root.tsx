import HomeIcon from "@mui/icons-material/Home";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import ListAltIcon from "@mui/icons-material/ListAlt";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import Sidebar, { SidebarLink } from "../components/shared/sidebar/sidebar";

export const Route = createRootRoute({
  component: RootComponent,
});

const sidebarLinks: SidebarLink[][] = [
  [{ text: "Home", icon: <HomeIcon />, link: "/" }],
  [
    { text: "Containers", icon: <ListAltIcon />, link: "/containers/list" },
    { text: "Images", icon: <Inventory2Icon />, link: "/images/list" },
  ],
];

function RootComponent() {
  return (
    <div className="vh-100 flex-column">
      <Sidebar sidebarLinks={sidebarLinks}>
        <Outlet />
      </Sidebar>
      <TanStackRouterDevtools />
    </div>
  );
}
