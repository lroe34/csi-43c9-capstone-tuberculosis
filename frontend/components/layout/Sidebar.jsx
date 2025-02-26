"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  HomeIcon,
  MagnifyingGlassIcon,
  ChartPieIcon,
  Cog6ToothIcon,
  ArrowLeftEndOnRectangleIcon,
  BeakerIcon,
  ScaleIcon,
} from "@heroicons/react/24/outline";

const sidebarItems = [
  { name: "Home", icon: HomeIcon, path: "/home" },
  { name: "Search", icon: MagnifyingGlassIcon, path: "/search" },
  { name: "Diagnose", icon: ScaleIcon, path: "/diagnose" },
  { name: "Results", icon: BeakerIcon, path: "/results" },
  { name: "Settings", icon: Cog6ToothIcon, path: "/settings" },
];

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigation = (path) => {
    router.push(path);
  };

  const handleLogout = () => {
    console.log("Logging out...");
    router.push("/login");
  };

  return (
    <aside className="w-16 h-screen bg-white flex flex-col items-center py-4 shadow-md border-r">
      <nav className="flex-1 flex flex-col space-y-8 mt-6">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;

          return (
            <button
              key={item.name}
              onClick={() => handleNavigation(item.path)}
              className={`p-3 rounded-lg flex items-center justify-center transition-all duration-200 
              ${
                isActive
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
