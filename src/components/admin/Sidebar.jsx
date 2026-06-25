import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { auth } from "../../services/auth";

// Import clean line icons from Lucide pack
import { 
  LuLayoutDashboard, 
  LuTags, 
  LuShoppingBag, 
  LuUsers, 
  LuCirclePlus, 
  LuUserPlus, 
  LuFolderPlus,
  LuLogOut,
  LuMenu,
  LuX
} from "react-icons/lu";

const navItems = [
  { to: "/admin/dashboard", icon: <LuLayoutDashboard size={18} />, label: "Dashboard" },
  { to: "/admin/categories", icon: <LuTags size={18} />, label: "Category" },
  { to: "/admin/products", icon: <LuShoppingBag size={18} />, label: "Products" },
  { to: "/admin/users", icon: <LuUsers size={18} />, label: "Users" },
  { to: "/admin/create-product", icon: <LuCirclePlus size={18} />, label: "Create Product" },
  { to: "/admin/create-user", icon: <LuUserPlus size={18} />, label: "Create User" },
  { to: "/admin/create-category", icon: <LuFolderPlus size={18} />, label: "Create Category" },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    auth.logout();
    navigate("/admin/login");
    setIsOpen(false);
  };

  return (
    <>
      {/* --- MOBILE HAMBURGER TOGGLE BUTTON --- */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-blue-950 text-white shadow-lg focus:outline-none flex items-center justify-center w-10 h-10 border border-blue-900 transition-colors"
        aria-label="Toggle navigation sidebar"
      >
        {isOpen ? <LuX size={24} /> : <LuMenu size={24} />}
      </button>

      {/* --- MOBILE ACCENT OVERLAY --- */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
        />
      )}

      {/* --- RESPONSIVE SIDEBAR NAVIGATION PANEL --- */}
      <aside
        className={`w-64 bg-blue-950 text-[#dedede] flex flex-col h-screen fixed lg:sticky top-0 left-0 z-40 shrink-0 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo / Brand Header */}
        <div className="p-6 text-2xl font-bold border-b border-gray-800/60 tracking-tight text-white flex justify-between items-center">
          <span>Admin.</span>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto custom-scrollbar">
          {navItems.map(({ to, icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setIsOpen(false)} // Auto-dismisses sidebar drawer on touch click
              className={({ isActive }) =>
                `flex items-center gap-3.5 py-2.5 px-4 rounded-xl transition-all duration-200 group text-sm ${
                  isActive
                    ? "bg-blue-900 text-white font-medium shadow-sm"
                    : "text-gray-400 hover:bg-blue-900/40 hover:text-white"
                }`
              }
            >
              <span className="transition-transform group-hover:scale-110 duration-200">
                {icon}
              </span>
              <span className="tracking-wide">{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-800/60 flex flex-col gap-2 bg-blue-950/90">
          <button
            onClick={handleLogout}
            className="w-full py-2.5 px-4 rounded-xl bg-red-600/90 text-white hover:bg-red-600 transition flex items-center justify-center gap-2 cursor-pointer font-medium text-sm active:scale-[0.98] shadow-md shadow-red-950/20"
          >
            <LuLogOut size={16} />
            <span>Logout</span>
          </button>
          <p className="text-[11px] text-gray-500 text-center mt-1 font-mono">
            &copy; 2026 Rework Admin
          </p>
        </div>
      </aside>
    </>
  );
}