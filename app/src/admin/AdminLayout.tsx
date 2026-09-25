import { Menu } from "lucide-react";
import { Outlet } from "react-router-dom";
import { useState } from "react";
import AdminSidebar from "./components/AdminSidebar";
import { useRequireAuth } from "../auth/useRequireAuth";

export default function AdminLayout() {
  const { checkingAuth, authenticated } = useRequireAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (checkingAuth || !authenticated) {
    return <div className="min-h-screen bg-slate-50" />;
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900">
      <AdminSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center border-b border-slate-200 bg-white/95 px-4 backdrop-blur lg:hidden">
          <button
            type="button"
            aria-label="Buka menu admin"
            className="rounded-xl p-2 text-slate-600 hover:bg-slate-100"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          <span className="ml-3 font-bold text-slate-900">Admin panel</span>
        </header>
        <Outlet />
      </div>
    </div>
  );
}