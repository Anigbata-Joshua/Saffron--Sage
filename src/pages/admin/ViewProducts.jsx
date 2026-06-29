import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "../../components/admin/DashboardLayout";
import PageTransition from "../../components/PageTransition";
import MessageBanner from "../../components/MessageBanner";
import ProductCard from "../../components/ui/ProductCard";
import EmptyState from "../../components/ui/EmptyState";
import { api } from "../../services/api"; // Intercepts requests using Axios wrapper now
import { auth } from "../../lib/auth";
import { useProducts } from "../../context/ProductsContext";
import { formatNaira } from "../../lib/format";
import { fadeUp, staggerContainer, staggerItem } from "../../animations";

export default function ViewProducts() {
  const merchantId = auth.getMerchantId();
  const { products: localProducts, removeProduct } = useProducts();
  const [apiProducts, setApiProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: "", color: "" });

  const products = localProducts.length > 0 ? localProducts : apiProducts;

  useEffect(() => {
    if (!merchantId) return;

    api.get(`/products?merchant_id=${merchantId}`)
      .then((res) => {
        // Since your updated api.js handles 'res.data' internally, 'res' is directly your payload array
        setApiProducts(Array.isArray(res) ? res : []);
      })
      .catch((err) => {
        console.error("Fetch inventory error:", err);
        setMessage({ 
          text: "Could not reach the warehouse — showing local inventory only.", 
          color: "text-amber-600" 
        });
      })
      .finally(() => setLoading(false));
  }, [merchantId]);

  const deleteProduct = (id) => {
    if (!confirm("Permanently remove this item?")) return;
    
    // Remove locally immediately for responsiveness; fire-and-forget API call.
    if (removeProduct) {
      removeProduct(id);
    }
    
    // Optimistically update apiProducts state in case local context falls back
    setApiProducts((prev) => prev.filter((product) => product.id !== id));

    api.delete(`/products/${id}`)
      .catch((err) => console.error("Failed to delete from server:", err));
      
    setMessage({ text: "Product removed.", color: "text-emerald-500" });
  };

  return (
    <PageTransition>
      <DashboardLayout title="Product Inventory">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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

          <MessageBanner message={message} className="mb-6" />

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
            <EmptyState title="Your inventory is currently empty." message="Add a product from the 'Create Product' tab to see it here." />
          ) : (
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
                  <ProductCard product={product} className="flex-1 flex flex-col [&>div:first-child]:flex-1" />
                  <div className="flex justify-center border-t border-gray-50 py-3">
                    <motion.button
                      onClick={() => deleteProduct(product.id)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-[10px] font-bold text-rose-400 hover:text-rose-600 tracking-[0.2em] uppercase transition cursor-pointer py-1 px-3"
                    >
                      Delete
                    </motion.button>
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