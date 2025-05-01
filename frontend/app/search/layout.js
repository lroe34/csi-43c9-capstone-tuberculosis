import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/Header";

export default function SearchLayout({ children }) {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <div className="ml-16">
        <div className="p-8">
          <Header />
          <div className="mt-6 space-y-4">{children}</div>
        </div>
      </div>
    </div>
  );

}
