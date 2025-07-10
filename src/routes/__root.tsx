import React from 'react'
import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import Sidebar, { SidebarLink } from '../components/shared/sidebar/sidebar';
import ListAltIcon from '@mui/icons-material/ListAlt';
import Inventory2Icon from '@mui/icons-material/Inventory2';

export const Route = createRootRoute({
  component: RootComponent,
})

const sidebarLinks: SidebarLink[][] = [
  [
    { text: 'Containers', icon: <ListAltIcon />, link: "/" },
    { text: 'Images', icon: <Inventory2Icon />, link: "/images/list" },
  ],
];

function RootComponent() {
  return (
    <React.Fragment>
      <Sidebar sidebarLinks={sidebarLinks}>
        <main className="main-container">
          <Outlet />
        </main>
      </Sidebar>
      <TanStackRouterDevtools />
    </React.Fragment>
  )
}
