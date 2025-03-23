import React from 'react'
import { BarChart3, Box, Building2, Component, Home, MessageSquareText, Notebook, NotebookPen, Settings, UserCircle } from "lucide-react";
import Sidebar, { SidebarItem } from './sidebarMenu';

export const SidebarComponents = () => {
  return (
    <main className="flex">
      <Sidebar>
        <SidebarItem icon={<Component size={20} />} text="Overview" active alert  />
        <SidebarItem icon={<NotebookPen size={20} />} text="Tasks"  />
        <SidebarItem icon={<MessageSquareText size={20} />} text="Messages" /> 
        <SidebarItem icon={<Building2 size={20} />} text="Business" /> 
        <hr className="my-2" />
        <SidebarItem icon={<UserCircle size={20} />} text="Users" />
        <SidebarItem icon={<Settings size={20} />} text="Setting" />
      </Sidebar>
    </main>
  )
}
