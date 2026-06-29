import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "../../components/admin/DashboardLayout";
import PageTransition from "../../components/PageTransition";
import { api } from "../../services/api";
import { auth } from "../../lib/auth";
import { useProducts } from "../../context/ProductsContext";
import { formatNaira } from "../../lib/format";
import { staggerContainer, staggerItem, fadeUp } from "../../animations";

export default function Dashboard() {
  const merchantId = auth.getMerchantId();
  const { products: localProducts } = useProducts();
  
  const [apiProducts, setApiProducts] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Fallback chaining identical to the creation flows
  const products = localProducts.length > 0 ? localProducts : apiProducts;

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (merchantId) {
          const res = await api.get(`/products?merchant_id=${merchantId}&limit=100`);
          setApiProducts(Array.isArray(res) ? res : (res.data || []));
        }

        const users = await api.get("/users");
        setTotalUsers(Array.isArray(users) ? users.length : 0);

        const cartData = localStorage.getItem("saffronSage_cart");
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

  const navLinks = [
    { label: "Overview", path: "/admin" },
    { label: "Products", path: "/admin/products" },
    { label: "Users", path: "/admin/users" },
  ];

  // Design Tokens mirroring creation components
  const labelClass = "block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3 sm:mb-4";

  return (
    <PageTransition>
      <DashboardLayout title="Management">
        {/* HEADER BAR */}
        <div className="flex justify-between items-center pb-6 border-b border-gray-100 mb-6">
          <h1 className="text-2xl font-semibold text-gray-800 tracking-wide">
            Dashboard Overview
          </h1>
          
          {/* Hamburger Menu Trigger */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex flex-col justify-center items-center w-8 h-8 space-y-1.5 focus:outline-none md:hidden z-50 relative"
            aria-label="Toggle navigation menu"
          >
            <span className={`block w-6 h-0.5 bg-gray-800 transition-transform duration-300 ease-in-out ${isMenuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block w-6 h-0.5 bg-gray-800 transition-opacity duration-300 ease-in-out ${isMenuOpen ? "opacity-0" : "opacity-100"}`} />
            <span className={`block w-6 h-0.5 bg-gray-800 transition-transform duration-300 ease-in-out ${isMenuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>

        {/* MOBILE SLIDE-OUT MENU */}
        <AnimatePresence>
          {isMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMenuOpen(false)}
                className="fixed inset-0 bg-black z-40 md:hidden"
              />
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                className="fixed top-0 right-0 h-full w-4/5 max-w-sm bg-white shadow-xl z-40 p-8 pt-24 md:hidden flex flex-col space-y-6"
              >
                <span className={labelClass}>Navigation</span>
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

        {/* DASHBOARD CONTENT BODY */}
        <div className="space-y-6 md:space-y-10">
          
          {/* STATS TILES GRID */}
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
                whileHover={{ y: -4, boxShadow: "0 8px 30px rgba(0,0,0,0.04)" }}
                className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between min-w-0"
              >
                <span className={labelClass}>{label}</span>
                <motion.p
                  className="text-2xl sm:text-3xl font-semibold text-gray-800 break-words"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                >
                  {loading ? <span className="animate-pulse text-gray-300">–</span> : value}
                </motion.p>
              </motion.div>
            ))}
          </motion.section>

          {/* TABLE CONTAINER */}
          <motion.section
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
          >
            <div className="p-5 border-b border-gray-100 flex justify-between items-center gap-4">
              <h2 className="text-xs font-bold text-gray-800 uppercase tracking-widest truncate">
                Inventory Preview (Top 10)
              </h2>
              <Link to="/admin/products" className="text-xs font-bold text-blue-600 uppercase tracking-widest hover:underline shrink-0">
                View All
              </Link>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left table-auto min-w-[600px] md:min-w-full">
                <thead className="bg-gray-50/70">
                  <tr>
                    {["Title", "Image", "Price", "Category"].map((h) => (
                      <th key={h} className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr>
                      <td colSpan="4" className="p-12 text-center text-gray-400 text-xs uppercase tracking-widest animate-pulse">
                        Loading inventory...
                      </td>
                    </tr>
                  ) : products.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="p-12 text-center text-gray-400 text-xs uppercase tracking-widest">
                        No products found.
                      </td>
                    </tr>
                  ) : (
                    products.slice(0, 10).map((product, i) => (
                      <motion.tr
                        key={product.id ?? product._id}
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.04 * i }}
                        className="hover:bg-gray-50/50 transition-colors border-b border-gray-100 text-sm text-gray-700"
                      >
                        <td className="px-6 py-4 font-medium max-w-[220px] truncate">
                          {product.title}
                        </td>
                        <td className="px-6 py-3">
                          <img
                            src={product.image ?? product.images}
                            alt={product.title}
                            className="h-10 w-10 object-cover rounded-lg border border-gray-100 shadow-sm"
                          />
                        </td>
                        <td className="px-6 py-4 font-semibold text-gray-900 whitespace-nowrap">
                          {formatNaira(product.price)}
                        </td>
                        <td className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                          {product.category?.name ?? product.category ?? "—"}
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