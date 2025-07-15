import * as React from "react";
import { styled, Theme, CSSObject } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Link } from "@tanstack/react-router";
import { FileRoutesByTo } from "../../../routeTree.gen";

export interface SidebarLink {
  text: string;
  link: keyof FileRoutesByTo;
  icon?: React.ReactNode;
}

const drawerWidth = 180;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const calculateClosedWidth = (theme: Theme) =>
  `calc(${theme.spacing(7)} + 1px)`;

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: calculateClosedWidth(theme),
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  variants: [
    {
      props: ({ open }) => open,
      style: {
        ...openedMixin(theme),
        "& .MuiDrawer-paper": openedMixin(theme),
      },
    },
    {
      props: ({ open }) => !open,
      style: {
        ...closedMixin(theme),
        "& .MuiDrawer-paper": closedMixin(theme),
      },
    },
  ],
}));

function SidebarLink({
  sidebarLink,
  sidebarExpanded,
}: {
  sidebarLink: SidebarLink;
  sidebarExpanded: boolean;
}) {
  return (
    <Link to={sidebarLink.link}>
      <ListItem key={sidebarLink.text} disablePadding sx={{ display: "block" }}>
        <ListItemButton
          sx={[
            {
              minHeight: 48,
              px: 2.5,
            },
            sidebarExpanded
              ? { justifyContent: "initial" }
              : { justifyContent: "center" },
          ]}
        >
          <ListItemIcon
            sx={[
              {
                minWidth: 0,
                justifyContent: "center",
              },
              sidebarExpanded ? { mr: 3 } : { mr: "auto" },
            ]}
          >
            {sidebarLink.icon}
          </ListItemIcon>
          <ListItemText
            primary={sidebarLink.text}
            sx={[sidebarExpanded ? { opacity: 1 } : { opacity: 0 }]}
          />
        </ListItemButton>
      </ListItem>
    </Link>
  );
}

export default function Sidebar({
  children,
  sidebarLinks,
}: {
  children: React.ReactNode;
  sidebarLinks: SidebarLink[][];
}) {
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box className="flex-row flex-grow">
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton
            onClick={() => (open ? handleDrawerClose() : handleDrawerOpen())}
          >
            {!open ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
        {sidebarLinks.map((sideBarSections, i) => (
          <React.Fragment key={sideBarSections?.[0].text}>
            <List>
              {sideBarSections.map((sidebarItem) => (
                <SidebarLink
                  key={sidebarItem.text}
                  sidebarLink={sidebarItem}
                  sidebarExpanded={open}
                />
              ))}
            </List>
            {i !== sidebarLinks.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </Drawer>
      <Box component="main" className="flex-column flex-grow">
        {children}
      </Box>
    </Box>
  );
}
