import React from 'react'
import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import Sidebar, { SidebarLink } from '../components/shared/sidebar/sidebar';
import ListAltIcon from '@mui/icons-material/ListAlt';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import HomeIcon from '@mui/icons-material/Home';

import "./root.css";

export const Route = createRootRoute({
  component: RootComponent,
})

const sidebarLinks: SidebarLink[][] = [
  [
    { text: 'Home', icon: <HomeIcon />, link: "/" },
  ],
  [
    { text: 'Containers', icon: <ListAltIcon />, link: "/containers/list" },
    { text: 'Images', icon: <Inventory2Icon />, link: "/images/list" },
  ],
];

function RootComponent() {
  return (
    <React.Fragment>
      <div className='vh-100'>
        <Sidebar sidebarLinks={sidebarLinks}>
          <div className="main-container h-100">
            <Outlet />
          </div>
        </Sidebar>
        <TanStackRouterDevtools />
      </div>
    </React.Fragment>
  )
}
