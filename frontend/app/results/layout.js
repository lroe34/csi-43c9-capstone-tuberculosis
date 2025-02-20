import Header from "@/components/Header";
import Sidebar from "@/components/layout/Sidebar";

export default function ResultsLayout({ children }) {
  return (
    <div className="flex min-h-screen ">
      <Sidebar />
      <div className="flex-1 p-8">
        <Header />
        <div className="mt-6 space-y-4">{children}</div>
      </div>
    </div>
  );
}
