"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  HomeIcon,
  MagnifyingGlassIcon,
  ArrowLeftEndOnRectangleIcon,
  BeakerIcon,
  ScaleIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "@/context/authContext";

const sidebarItems = [
  { name: "Home", icon: HomeIcon, path: "/home" },
  { name: "Search", icon: MagnifyingGlassIcon, path: "/search" },
  { name: "Diagnose", icon: ScaleIcon, path: "/diagnose" },
  { name: "Results", icon: BeakerIcon, path: "/results" },
];

const Sidebar = () => {
  const { logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { token, user, isLoading } = useAuth();

  const itemsToRender = isLoading
    ? []
    : sidebarItems.filter((item) => {
        if (!user || !user.isDoctor) {
          return item.path !== "/home" && item.path !== "/search";
        }
        return true;
      });

  const handleNavigation = (path) => {
    router.push(path);
  };

  const handleLogout = () => {
    logout();
    console.log("Logging out...");
    router.push("/login");
  };

  return (
    <aside className="fixed top-0 left-0 w-16 h-screen bg-white flex flex-col items-center py-4 shadow-md border-r z-50">
      <nav className="flex-1 flex flex-col space-y-8 mt-6">
        {isLoading && (
          <div className="space-y-8 p-3">
            <div className="h-6 w-6 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="h-6 w-6 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
        )}

        {!isLoading &&
          itemsToRender.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;

            return (
              <button
                key={item.name}
                onClick={() => handleNavigation(item.path)}
                title={item.name}
                className={`p-3 rounded-lg flex items-center justify-center transition-all duration-200
              ${
                isActive
                  ? "text-yellow-600 bg-yellow-50"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
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
