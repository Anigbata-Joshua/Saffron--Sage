import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "../../components/admin/DashboardLayout";
import { api } from "../../services/api";
import { auth } from "../../services/auth";
import PageTransition from "../../components/PageTransition";
import { staggerContainer, staggerItem, fadeUp } from "../../animations";

export default function Dashboard() {
  const merchantId = auth.getMerchantId();
  const [products, setProducts] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);
  
  // Mobile Mobile Menu State
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (merchantId) {
          const res = await api.get(`/products?merchant_id=${merchantId}`);
          setProducts(res.data || []);
        }
        
        const users = await api.get("/users");
        setTotalUsers(Array.isArray(users) ? users.length : 0);
        
        const cartData = localStorage.getItem("bohemian_cart");
        if (cartData) {
          const items = JSON.parse(cartData);
          setCartCount(items.reduce((acc, item) => acc + (Number(item.quantity) || 1), 0));
        }
      } catch (err) {
        console.error("Dashboard load error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [merchantId]);

  const stats = [
    { label: "Total Products", value: products.length },
    { label: "Total Users", value: totalUsers },
    { label: "Cart Items", value: cartCount },
  ];

  // Mobile menu items mapping
  const navLinks = [
    { label: "Overview", path: "/admin" },
    { label: "Products", path: "/admin/products" },
    { label: "Users", path: "/admin/users" },
  ];

  return (
    <PageTransition>
      <DashboardLayout title="Overview">
        {/* RESPONSIVE HEADER BAR WITH HAMBURGER MENU */}
        <div className="flex justify-between items-center pb-6 md:pb-8 border-b border-gray-100 mb-6 px-2 sm:px-4 md:px-0">
          <h1 className="text-xl sm:text-2xl font-light text-gray-800 tracking-wide">
            Dashboard Overview
          </h1>
          
          {/* Hamburger Icon: Visible on mobile/tablet, hidden on md viewports */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex flex-col justify-center items-center w-8 h-8 space-y-1.5 focus:outline-none md:hidden z-50 relative"
            aria-label="Toggle navigation menu"
          >
            <span 
              className={`block w-6 h-0.5 bg-gray-800 transition-transform duration-300 ease-in-out ${
                isMenuOpen ? "rotate-45 translate-y-2" : ""
              }`} 
            />
            <span 
              className={`block w-6 h-0.5 bg-gray-800 transition-opacity duration-300 ease-in-out ${
                isMenuOpen ? "opacity-0" : "opacity-100"
              }`} 
            />
            <span 
              className={`block w-6 h-0.5 bg-gray-800 transition-transform duration-300 ease-in-out ${
                isMenuOpen ? "-rotate-45 -translate-y-2" : ""
              }`} 
            />
          </button>
        </div>

        {/* MOBILE SLIDE-OUT OVERLAY NAVIGATION */}
        <AnimatePresence>
          {isMenuOpen && (
            <>
              {/* Darkened background backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMenuOpen(false)}
                className="fixed inset-0 bg-black z-40 md:hidden"
              />
              
              {/* Menu Container */}
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                className="fixed top-0 right-0 h-full w-4/5 max-w-sm bg-white shadow-xl z-40 p-8 pt-24 md:hidden flex flex-col space-y-6"
              >
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4 block">
                  Navigation
                </span>
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    to={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className="text-lg font-light text-gray-800 tracking-wide hover:text-blue-600 transition-colors py-2 border-b border-gray-50"
                  >
                    {link.label}
                  </Link>
                ))}
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* MAIN BODY LAYOUT */}
        <div className="space-y-6 md:space-y-10 px-2 sm:px-4 md:px-0">
          
          {/* STATS GRID */}
          <motion.section
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {stats.map(({ label, value }) => (
              <motion.div
                key={label}
                variants={staggerItem}
                whileHover={{ y: -4, boxShadow: "0 8px 30px rgba(0,0,0,0.08)" }}
                className="bg-white p-5 sm:p-8 rounded-2xl shadow-sm border border-gray-50 flex flex-col justify-between min-w-0"
              >
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-3 sm:mb-4 block truncate">
                  {label}
                </span>
                <motion.p
                  className="text-2xl sm:text-3xl lg:text-4xl font-light text-gray-800 break-words"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                >
                  {loading ? <span className="animate-pulse">–</span> : value}
                </motion.p>
              </motion.div>
            ))}
          </motion.section>

          {/* INVENTORY PREVIEW SECTION */}
          <motion.section
            className="bg-white rounded-2xl shadow-sm border border-gray-50 overflow-hidden"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
          >
            <div className="p-4 sm:p-6 border-b border-gray-50 flex flex-row justify-between items-center gap-4">
              <h2 className="text-[10px] sm:text-xs font-bold text-gray-800 uppercase tracking-widest truncate">
                Inventory Preview (Top 10)
              </h2>
              <Link 
                to="/admin/products" 
                className="text-[10px] font-bold text-blue-600 uppercase tracking-widest hover:underline shrink-0"
              >
                View All
              </Link>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left table-auto min-w-[600px] md:min-w-full">
                <thead className="bg-gray-50/50">
                  <tr>
                    {["Title", "Image", "Price", "Category"].map((h) => (
                      <th 
                        key={h} 
                        className="px-4 sm:px-6 py-3 sm:py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {loading ? (
                    <tr>
                      <td colSpan="4" className="p-10 text-center text-gray-400 text-xs uppercase tracking-widest animate-pulse">
                        Loading inventory...
                      </td>
                    </tr>
                  ) : products.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="p-10 text-center text-gray-400 text-xs">
                        No products found.
                      </td>
                    </tr>
                  ) : (
                    products.slice(0, 10).map((product, i) => (
                      <motion.tr
                        key={product.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 * i }}
                        className="hover:bg-gray-50 transition-colors border-b border-gray-100 text-xs"
                      >
                        <td className="px-4 sm:px-6 py-3 sm:py-4 font-medium uppercase tracking-widest max-w-[220px] truncate">
                          {product.title}
                        </td>
                        <td className="px-4 sm:px-6 py-3 sm:py-4 flex justify-center">
                          <img 
                            src={product.image} 
                            alt={product.title} 
                            className="h-10 w-10 sm:h-12 sm:w-12 object-cover rounded shadow-sm" 
                          />
                        </td>
                        <td className="px-4 sm:px-6 py-3 sm:py-4 font-semibold text-stone-800 whitespace-nowrap">
                          Tracking ₦{product.price}
                        </td>
                        <td className="px-4 sm:px-6 py-3 sm:py-4 text-[10px] font-bold text-gray-700 uppercase tracking-widest whitespace-nowrap">
                          {product.category?.name || "—"}
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </motion.section>
        </div>
      </DashboardLayout>
    </PageTransition>
  );
}