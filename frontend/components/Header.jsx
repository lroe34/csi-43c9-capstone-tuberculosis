"use client";

import { usePathname } from "next/navigation";

export default function Header() {
  const today = new Date().toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const pathname = usePathname();
  const pageTitles = {
    "/diagnose": "Diagnosis Tool",
    "/results": "Results",
    "/search": "Search",
    "/home": "Home",
    "/delete-request": "Delete Request",
  };
  const title = pageTitles[pathname] || "App";

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900">{title}</h1>
      <p className="text-gray-500">{today}</p>
    </div>
  );
}
