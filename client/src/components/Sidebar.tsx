import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import { LuLayoutDashboard } from "react-icons/lu";
import { FiUsers } from "react-icons/fi";
import { MdOutlineInventory2 } from "react-icons/md";
import { AiOutlineUnorderedList } from "react-icons/ai";
import { MdPayments } from "react-icons/md";
import {
  MdOutlineKeyboardDoubleArrowLeft,
  MdOutlineKeyboardDoubleArrowRight,
} from "react-icons/md";

import { useTheme } from "../Context/ThemeContext";
// import ThemeToggle from "./ThemeToggle";

const Sidebar = () => {
  const [open, setOpen] = useState(true); // State to control sidebar open/close
  const location = useLocation(); // Get the current location
  const { theme } = useTheme();

  const pathnames = location.pathname.split('/').filter(x => x)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
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
      icon: <LuLayoutDashboard className="text-lg" />,
    },
    {
      label: "Customers",
      path: "customers",
      icon: <FiUsers className="text-lg" />,
    },
    {
      label: "Inventory",
      path: "inventory/products",
      icon: <MdOutlineInventory2 className="text-lg" />,
    },
    {
      label: "Orders",
      path: "orders",
      icon: <AiOutlineUnorderedList className="text-lg" />,
    },
    {
      label: "Payments",
      path: "payments",
      icon: <MdPayments className="text-lg" />,
    },
  ];

  const handleToggle = () => {
    setOpen((prev) => !prev);
  };

  // Define styles based on the theme
  const sidebarStyles = {
    backgroundColor: theme === "light" ? "#ffffff" : "#333333",
    color: theme === "light" ? "#000000" : "#ffffff",
  };

  // Define active item styles based on the theme
  const activeItemStyles = {
    light: "bg-blue-200 text-blue-800", // Light theme active styles
    dark: "bg-blue-800 text-white", // Dark theme active styles
  };

  return (
    <div
      style={sidebarStyles}
      className={`h-[100vh] border-r text-black ${
        open ? "w-64" : "w-16"
      } flex flex-col justify-between`}
    >
      <div className={`flex flex-col ${open ? "" : "items-center"}`}>
        {/* Sidebar Head */}
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

        {/* Item List */}
        <div className="p-4 flex flex-col gap-4">
          {items?.map((item, index) => {
            const isActive = item.path.includes(pathnames[0]) ? true : false;

            return (
              <Link
                key={index}
                to={`/${item.path}`}
                className={`px-2 py-1 rounded-sm flex justify-start items-center gap-4 ${
                  isActive
                    ? theme === "light"
                      ? activeItemStyles.light
                      : activeItemStyles.dark
                    : ""
                } hover:bg-neutral-100`}
              >
                {item.icon}
                {open && <span className="text-md">{item.label}</span>}
              </Link>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default Sidebar;
