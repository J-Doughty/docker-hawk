import React from 'react'
import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import Sidebar, { SidebarLink } from '../components/shared/sidebar/sidebar';
import ListAltIcon from '@mui/icons-material/ListAlt';
import Inventory2Icon from '@mui/icons-material/Inventory2';

import "./root.css";

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
      <div className='min-vh-100 flex-column'>
        <Sidebar sidebarLinks={sidebarLinks}>
          <main className="main-container flex-column flex-grow">
            <Outlet />
          </main>
        </Sidebar>
        <TanStackRouterDevtools />
      </div>
    </React.Fragment>
  )
}
