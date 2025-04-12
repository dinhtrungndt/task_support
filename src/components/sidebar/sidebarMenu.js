import { MoreVertical, ChevronLast, ChevronFirst } from "lucide-react"
import React, { useContext, createContext, useState, use, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { DropdownMenuLogout } from "../DropdownMenu/logout";
import {  useSelector } from "react-redux";

const SidebarContext = createContext()

export default function Sidebar({ children }) {
  const [expanded, setExpanded] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { currentUser } = useSelector((state) => state.users);

  return (
    <aside className="h-screen sticky top-0">
      <nav className="h-full flex flex-col bg-white border-r shadow-sm">
        <div className="p-2 pb-1 flex justify-between items-center">
          <img
            src={require("../../assets/image/Logomark.png")}
            className={`overflow-hidden transition-all ${expanded ? "w-6" : "w-0"
              }`}
            alt=""
          />
          <h3 className={`overflow-hidden transition-all ${expanded ? "font-semibold text-sm" : "w-0"
            }`}>Task Support</h3>
          <button
            onClick={() => setExpanded((curr) => !curr)}
            className="p-1 rounded-lg bg-gray-50 hover:bg-gray-100"
          >
            {expanded ? <ChevronFirst size={16} /> : <ChevronLast size={16} />}
          </button>
        </div>

        <SidebarContext.Provider value={{ expanded }}>
          <ul className="flex-1 px-2">{children}</ul>
        </SidebarContext.Provider>

        <div className="border-t flex p-2 sticky bottom-0 bg-white">
          {
            expanded ? (
              <img
                src={
                  currentUser?.avatar || "https://via.placeholder.com/150"
                }
                alt=""
                className="w-8 h-8 rounded-md"
              />
            ) : (
              <div onClick={() => setDropdownOpen(!dropdownOpen)} className="w-8 h-8 rounded-md bg-gray-200 flex items-center justify-center cursor-pointer">
                <img
                  src={
                    currentUser?.avatar || "https://via.placeholder.com/150"
                  }
                  alt=""
                  className="w-8 h-8 rounded-md"
                />
                {
                  dropdownOpen && (
                    <div className="absolute z-50 left-52 top-4">
                      <DropdownMenuLogout />
                    </div>
                  )}
              </div>
            )
          }
          <div
            className={`
              flex justify-between items-center
              overflow-hidden transition-all ${expanded ? "w-40 ml-2" : "w-0"}
            `}
          >
            <div className="leading-3 overflow-hidden">
              <h4 className="font-semibold text-sm truncate">{currentUser?.name}</h4>
              <span className="text-xs text-gray-600 truncate">{currentUser?.email}</span>
            </div>
            <div className="relative">
              <MoreVertical
                className="cursor-pointer"
                size={16}
                onClick={() => setDropdownOpen(!dropdownOpen)}
              />
              {dropdownOpen && (
                <div className="absolute bottom-full right-0 z-50">
                  <DropdownMenuLogout />
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </aside>
  )
}

export function SidebarItem({ icon, text, to, alert }) {
  const { expanded } = useContext(SidebarContext);
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <li
      className={`
        relative flex items-center py-1 px-2 my-1
        font-medium rounded-md cursor-pointer
        transition-colors group
        ${isActive
          ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800"
          : "hover:bg-indigo-50 text-gray-600"
        }
      `}
    >
      <Link to={to} className="flex items-center">
        {icon && React.cloneElement(icon, { size: 16 })}
        <span
          className={`overflow-hidden transition-all ${expanded ? "w-40 ml-2" : "w-0"}`}
        >
          {text}
        </span>

        {/* 🔔 Alert badge - Giữ nguyên vị trí khi active */}
        {alert && (
          <div
            className={`
              absolute right-2 w-1.5 h-1.5 rounded transition-all
              ${isActive ? "bg-red-500 animate-ping" : ""}
            `}
          />
        )}

        {/* Tooltip khi sidebar thu gọn */}
        {!expanded && (
          <div
            className={`
              absolute left-full top-1/2 -translate-y-1/2
              rounded-md px-2 py-1 ml-2 bg-indigo-100 text-indigo-800 text-xs
              opacity-0 translate-x-[-10px] transition-all duration-300
              group-hover:opacity-100 group-hover:translate-x-0
            `}
          >
            {text}
          </div>
        )}
      </Link>
    </li>
  );
}