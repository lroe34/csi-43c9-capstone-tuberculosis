import Sidebar from "@/components/layout/Sidebar";

export default function DiagnoseLayout({ children }) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 overflow-auto p-5">{children}</div>
    </div>
  );
}
