import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "../../components/admin/DashboardLayout";
import PageTransition from "../../components/PageTransition";
import { api } from "../../services/api";
import { auth } from "../../services/auth";
import { staggerContainer, staggerItem, fadeUp } from "../../animations";

export default function ViewCategories() {
  const merchantId = auth.getMerchantId();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await api.get(`/categories?merchant_id=${merchantId}`);
      setCategories(Array.isArray(data) ? data : []);
    } catch(err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchCategories(); }, []);

  const deleteCategory = async (id) => {
    if (!confirm("Delete this category?")) return;
    await api.delete(`/categories/${id}`).catch(console.error);
    fetchCategories();
  };

  return (
    <PageTransition>
      <DashboardLayout title="Product Categories">
        <div className="max-w-4xl mx-auto">
          <motion.div className="bg-white shadow-sm rounded-2xl overflow-hidden border border-gray-100"
            variants={fadeUp} initial="hidden" animate="visible">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-[0.2em] text-center">Category Name</th>
                  <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-[0.2em] text-center">Actions</th>
                </tr>
              </thead>
              <motion.tbody variants={staggerContainer} initial="hidden" animate="visible" className="divide-y divide-gray-50">
                {loading ? (
                  <tr><td colSpan="2" className="p-10 text-center text-gray-400 text-xs uppercase animate-pulse tracking-widest">Loading categories...</td></tr>
                ) : categories.length === 0 ? (
                  <tr><td colSpan="2" className="px-6 py-4 text-center text-gray-400">No categories found.</td></tr>
                ) : categories.map((cat) => (
                  <motion.tr key={cat.id || cat._id} variants={staggerItem} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-gray-700 font-medium">{cat.name}</td>
                    <td className="px-6 py-4 text-center">
                      <motion.button onClick={() => deleteCategory(cat.id || cat._id)}
                        whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                        className="text-rose-500 text-[10px] font-bold tracking-widest uppercase cursor-pointer hover:underline">
                        Delete
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </motion.tbody>
            </table>
          </motion.div>
        </div>
      </DashboardLayout>
    </PageTransition>
  );
}
