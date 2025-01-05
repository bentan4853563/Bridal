// ThemeToggle.tsx
import React from "react";
import { useTheme } from "../Context/ThemeContext";

import { ImSun } from "react-icons/im";
import { BiSolidMoon } from "react-icons/bi";
import { Switch } from "@mui/material";

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="p-4 flex items-center gap-2">
      <label>
        {theme === "light" ? (
          <ImSun className="h-5 w-5 text-yellow-500" />
        ) : (
          <BiSolidMoon className="h-5 w-5 text-blue-500" />
        )}
      </label>
      <Switch
        size="small"
        onClick={toggleTheme}
        defaultChecked={theme === "dark"}
      />
      <span>
        {theme === "light" ? "Light Mode" : "Dark Mode"}
      </span>
    </div>
  );
};

export default ThemeToggle;
