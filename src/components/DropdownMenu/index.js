import { Edit, MoreHorizontal } from "lucide-react";
import { useEffect, useRef } from "react";

const DropdownMenu = ({ isOpen, onClose, onEdit, onMore }) => {
    const menuRef = useRef(null);
  
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
          onClose();
        }
      };
  
      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
      }
  
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [isOpen, onClose]);
  
    if (!isOpen) return null;
  
    return (
      <div 
        ref={menuRef}
        className="absolute right-4 mt-1 w-32 bg-white rounded-md shadow-lg z-10 border border-gray-200"
      >
        <ul className="py-1">
          <li 
            className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer flex items-center"
            onClick={onEdit}
          >
            <Edit size={14} className="mr-2" />
            <span>Edit</span>
          </li>
          <li 
            className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer flex items-center"
            onClick={onMore}
          >
            <MoreHorizontal size={14} className="mr-2" />
            <span>More</span>
          </li>
        </ul>
      </div>
    );
  };

export default DropdownMenu;