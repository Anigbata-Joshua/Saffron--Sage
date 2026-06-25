import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "../../components/admin/DashboardLayout";
import PageTransition from "../../components/PageTransition";
import { api } from "../../services/api";
import { auth } from "../../services/auth";
import { fadeUp, staggerContainer, staggerItem } from "../../animations";

export default function ViewProducts() {
  const merchantId = auth.getMerchantId();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const fetchProducts = async () => {
    if (!merchantId) { setMessage("Error: Merchant ID not found."); setLoading(false); return; }
    try {
      const res = await api.get(`/products?merchant_id=${merchantId}`);
      setProducts(Array.isArray(res) ? res : (res.data || []));
    } catch { setMessage("Could not connect to the warehouse."); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProducts(); }, []);

  const deleteProduct = async (id) => {
    if (!confirm("Permanently remove this item?")) return;
    await api.delete(`/products/${id}`).catch(console.error);
    fetchProducts();
  };

  return (
<PageTransition>
  <DashboardLayout title="Product Inventory">
    {/* Added padding context wrapper to shield edges across viewport shifts */}
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* HEADER SECTION */}
      <motion.div 
        className="mb-6 sm:mb-10 text-center" 
        variants={fadeUp} 
        initial="hidden" 
        animate="visible"
      >
        <span className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.3em] block mb-2">
          Warehouse
        </span>
        <h2 className="text-2xl sm:text-3xl font-light text-gray-800 tracking-tight">
          Active Inventory
        </h2>
      </motion.div>

      {/* LOADING STATE - Now fully responsive to match the actual grid layout */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {[1, 2, 3].map((i) => (
            <motion.div 
              key={i} 
              className="bg-white aspect-square rounded-2xl border border-gray-100 shadow-sm"
              animate={{ opacity: [0.4, 0.8, 0.4] }} 
              transition={{ repeat: Infinity, duration: 1.4, delay: i * 0.2 }} 
            />
          ))}
        </div>
      ) : products.length === 0 ? (
        <p className="text-center text-gray-400 py-20 uppercase tracking-widest text-xs">
          {message || "Your inventory is currently empty."}
        </p>
      ) : (
        /* PRODUCT GRID CONTAINER - Fluid gaps based on screen size */
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
          variants={staggerContainer} 
          initial="hidden" 
          animate="visible"
        >
          {products.map((product) => (
            <motion.div 
              key={product.id} 
              variants={staggerItem}
              whileHover={{ y: -6, boxShadow: "0 12px 40px rgba(0,0,0,0.08)" }}
              className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm transition-all duration-300 flex flex-col"
            >
              {/* Product Image Wrapper */}
              <div className="aspect-square bg-gray-50 overflow-hidden relative">
                <img 
                  src={product.image} 
                  alt={product.title} 
                  className="w-full h-full object-cover" 
                />
              </div>
              
              {/* Content Block */}
              <div className="p-5 sm:p-6 text-center flex flex-col flex-1 justify-between">
                <div>
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-800 uppercase tracking-tight mb-1 truncate px-2">
                    {product.title}
                  </h3>
                  <p className="text-base sm:text-lg font-light text-gray-900 mb-4">
                    ₦{product.price}
                  </p>
                </div>
                
                {/* Actions Row */}
                <div className="flex items-center justify-center gap-6 border-t border-gray-50 pt-4 mt-auto">
                  <motion.button 
                    onClick={() => deleteProduct(product.id)} 
                    whileHover={{ scale: 1.05 }} 
                    whileTap={{ scale: 0.95 }}
                    className="text-[10px] font-bold text-red-400 hover:text-red-600 tracking-[0.2em] uppercase transition cursor-pointer py-1 px-3"
                  >
                    Delete
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  </DashboardLayout>
</PageTransition>
  );
}
