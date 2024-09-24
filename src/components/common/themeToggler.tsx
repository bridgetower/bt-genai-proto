import { Sun } from "lucide-react";
import React, { useEffect, useState } from "react";

import { Button } from "./button";

const ThemeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Sync the theme with localStorage and document class
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setIsDarkMode(true);
    } else {
      document.documentElement.classList.remove("dark");
      setIsDarkMode(false);
    }
  }, []);

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
    setIsDarkMode(!isDarkMode);
  };

  return (
    <Button variant={"outline"} size={"icon"} className="ml-3 hover:bg-none h-8 w-8 border-0">
      <Sun className="text-primary cursor-pointer" onClick={toggleTheme} />
    </Button>
  );
};

export default ThemeToggle;
