import { Component, NotebookPen, MessageSquareText, Building2, Settings, UserCircle } from "lucide-react";
import Sidebar, { SidebarItem } from './sidebarMenu';

export const SidebarComponents = () => {
  return (
    <Sidebar>
      <hr className="my-2" />
      <SidebarItem icon={<Component size={20} />} text="Overview" to="/" active alert/>
      <SidebarItem icon={<NotebookPen size={20} />} text="Task" to="/task" alert />
      <SidebarItem icon={<NotebookPen size={20} />} text="Service" to="/service" alert />
      <SidebarItem icon={<Building2 size={20} />} text="Business" to="/business" alert />
      <SidebarItem icon={<MessageSquareText size={20} />} text="Message" to="/message" alert />
      <hr className="my-2" />
      <SidebarItem icon={<UserCircle size={20} />} text="Users" to="/users"  alert/>
      <SidebarItem icon={<Settings size={20} />} text="Setting" to="/settings" alert />
    </Sidebar>
  );
};
