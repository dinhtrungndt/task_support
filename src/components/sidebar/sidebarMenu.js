import { MoreVertical, ChevronLast, ChevronFirst } from "lucide-react"
import { useContext, createContext, useState } from "react"
import { Link, useLocation } from "react-router-dom"

const SidebarContext = createContext()

export default function Sidebar({ children }) {
  const [expanded, setExpanded] = useState(true)

  return (
    <aside className="h-screen">
      <nav className="h-full flex flex-col bg-white border-r shadow-sm">
        <div className="p-4 pb-2 flex justify-between items-center">
          <img
            src={require("../../assets/image/Logomark.png")}
            className={`overflow-hidden transition-all ${expanded ? "w-9" : "w-0"
              }`}
            alt=""
          />
          <h3 className={`overflow-hidden transition-all ${expanded ? "font-semibold text-base" : "w-0"
            }`}>Task Support</h3>
          <button
            onClick={() => setExpanded((curr) => !curr)}
            className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100"
          >
            {expanded ? <ChevronFirst /> : <ChevronLast />}
          </button>
        </div>

        <SidebarContext.Provider value={{ expanded }}>
          <ul className="flex-1 px-3">{children}</ul>
        </SidebarContext.Provider>

        <div className="border-t flex p-3">
          <img
            src="https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true"
            alt=""
            className="w-10 h-10 rounded-md"
          />
          <div
            className={`
              flex justify-between items-center
              overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}
          `}
          >
            <div className="leading-4">
              <h4 className="font-semibold">John Doe</h4>
              <span className="text-xs text-gray-600">johndoe@gmail.com</span>
            </div>
            <MoreVertical size={20} className="cursor-pointer" />
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
        relative flex items-center py-2 px-3 my-1
        font-medium rounded-md cursor-pointer
        transition-colors group
        ${isActive
          ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800"
          : "hover:bg-indigo-50 text-gray-600"
        }
      `}
    >
      <Link to={to} className="flex items-center">
        {icon}
        <span
          className={`overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}`}
        >
          {text}
        </span>

        {/* 🔔 Alert badge - Giữ nguyên vị trí khi active */}
        {alert && (
          <div
            className={`
              absolute right-2 w-2 h-2 rounded transition-all
              ${isActive ? "bg-red-500 animate-ping" : ""}
            `}
          />
        )}

        {/* Tooltip khi sidebar thu gọn */}
        {!expanded && (
          <div
            className={`
              absolute left-full top-1/2 -translate-y-1/2
              rounded-md px-2 py-1 ml-2 bg-indigo-100 text-indigo-800 text-sm
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
