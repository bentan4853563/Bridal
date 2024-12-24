import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import { LuLayoutDashboard } from "react-icons/lu";
import { FiUsers } from "react-icons/fi";
import { MdOutlineInventory2 } from "react-icons/md";
import { AiOutlineUnorderedList } from "react-icons/ai";
import { MdOutlineKeyboardDoubleArrowLeft } from "react-icons/md";
import { MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";

const Sidebar = () => {
  const [open, setOpen] = useState(true); // State to control sidebar open/close
  const location = useLocation(); // Get the current location

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        // 768px is the 'md' breakpoint in Tailwind
        setOpen(false);
      } else {
        setOpen(true);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Call once to set initial state

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const items = [
    {
      label: "Dashboard",
      path: "dashboard",
      icon: <LuLayoutDashboard className="text-xl" />,
    },
    {
      label: "Customers",
      path: "customers",
      icon: <FiUsers className="text-xl" />,
    },
    {
      label: "Inventory",
      path: "inventory",
      icon: <MdOutlineInventory2 className="text-xl" />,
    },
    {
      label: "Orders",
      path: "orders",
      icon: <AiOutlineUnorderedList className="text-xl" />,
    },
  ];

  const handleToggle = () => {
    setOpen((prev) => !prev);
  };

  return (
    <div className={`h-[100vh] border-r text-black ${open ? "w-64" : "w-16"}`}>
      <div className="px-4 py-6 border-b flex justify-between items-center">
        {open && (
          <Link to="/" className="text-2xl">
            Bridal
          </Link>
        )}
        {open ? (
          <MdOutlineKeyboardDoubleArrowLeft
            onClick={handleToggle}
            className="text-lg cursor-pointer"
          />
        ) : (
          <MdOutlineKeyboardDoubleArrowRight
            onClick={handleToggle}
            className="text-lg cursor-pointer my-[7px]"
          />
        )}
      </div>
      <div className="p-4 flex flex-col gap-4">
        {items.map((item, index) => {
          // Check if the current path includes the item's path
          const isActive = location.pathname.includes(item.path);

          return (
            <Link
              key={index}
              to={`/${item.path}`}
              className={`px-2 py-1 rounded-sm flex justify-start items-center gap-4 ${
                isActive ? "bg-neutral-100" : ""
              } hover:bg-neutral-100`}
            >
              {item.icon}
              {open && <span className="text-lg">{item.label}</span>}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
