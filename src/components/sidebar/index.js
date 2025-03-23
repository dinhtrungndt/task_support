import React from 'react'
import { BarChart3, Box, LayoutDashboard, Settings, UserCircle } from "lucide-react";
import Sidebar, { SidebarItem } from './sidebarMenu';

export const SidebarComponents = () => {
  return (
    <main className="flex">
      <Sidebar>
        <SidebarItem icon={<LayoutDashboard size={20} />}
        text="Dashboard" active alert  />
        <SidebarItem icon={<BarChart3 size={20} 
         />}
        text="Sidebar"  />
        <SidebarItem icon={<UserCircle size={20} />}
        text="Sidebar" /> 
        <hr className="my-2" />
        <SidebarItem icon={<Box size={20} />}
        text="Users" />
        <SidebarItem icon={<Settings size={20} />}
        text="User" />
      </Sidebar>
    </main>
  )
}
