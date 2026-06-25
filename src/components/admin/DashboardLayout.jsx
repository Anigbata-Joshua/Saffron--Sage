import Sidebar from "./Sidebar";
import Header from "./Header";

export default function DashboardLayout({ title, children }) {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-y-auto">
        <Header title={title} />
        <main className="flex-1 p-8 bg-gray-50/50">
          {children}
        </main>
      </div>
    </div>
  );
}
