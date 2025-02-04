"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  HomeIcon,
  MagnifyingGlassIcon,
  ChartPieIcon,
  Cog6ToothIcon,
  ArrowLeftEndOnRectangleIcon,
} from "@heroicons/react/24/outline";

const sidebarItems = [
  { name: "Home", icon: HomeIcon, path: "/home" },
  { name: "Search", icon: MagnifyingGlassIcon, path: "/search" },
  { name: "Diagnose", icon: ChartPieIcon, path: "/diagnose" },
  { name: "Results", icon: ChartPieIcon, path: "/results" },
  { name: "Settings", icon: Cog6ToothIcon, path: "/settings" },
];

const Sidebar = () => {
  const router = useRouter();
  const [active, setActive] = useState("Home");

  const handleNavigation = (path, name) => {
    setActive(name);
    router.push(path);
  };

  const handleLogout = () => {
    //TODO: this
    console.log("Logging out...");

    router.push("/");
  };

  return (
    <aside className="w-16 h-screen bg-white flex flex-col items-center py-4 shadow-md border-r">
      <nav className="flex-1 flex flex-col space-y-8 mt-6">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.name}
              onClick={() => handleNavigation(item.path, item.name)}
              className={`p-3 rounded-lg flex items-center justify-center transition-all duration-200 
              ${
                active === item.name
                  ? "text-yellow-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <Icon className="w-6 h-6" />
            </button>
          );
        })}
      </nav>
      <div className="mb-4">
        <button
          onClick={handleLogout}
          className="p-3 rounded-lg flex items-center justify-center text-gray-600 hover:text-gray-800 transition-all duration-200"
        >
          <ArrowLeftEndOnRectangleIcon className="w-6 h-6" />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
