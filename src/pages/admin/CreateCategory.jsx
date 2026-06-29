import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import DashboardLayout from "../../components/admin/DashboardLayout";
import PageTransition from "../../components/PageTransition";
import MessageBanner from "../../components/MessageBanner";
import { api } from "../../services/api";
import { auth } from "../../lib/auth";
import { useProducts } from "../../context/ProductsContext";
import { scaleIn } from "../../animations";

export default function CreateCategory() {
  const navigate = useNavigate();
  const merchantId = auth.getMerchantId();
  const { addCategory } = useProducts();

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState({ text: "", color: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanTitle = title.trim();

    if (!cleanTitle) {
      return setMessage({ text: "Please enter a category title.", color: "text-rose-500" });
    }
    if (!merchantId) {
      return setMessage({ text: "Error: Merchant ID missing.", color: "text-rose-500" });
    }

    setLoading(true);
    setMessage({ text: "Creating category...", color: "text-stone-500" });

    try {
      const data = await api.post("/categories", {
        name: cleanTitle,
        merchant_id: merchantId,
        image: ""
      });
      const createdId = data.id ?? data._id;// Nullish Coalescing Operator

      // Always optimistic-save to context to update ui sidebar instantly
      if (addCategory) {
        addCategory({
          id: createdId ?? `cat-local-${Date.now()}`,
          name: cleanTitle,
          merchant_id: merchantId,
        });
      }

      if (createdId) {
        setMessage({ text: "Category created successfully! Redirecting...", color: "text-emerald-500" });
        setTitle("");
        setTimeout(() => navigate("/admin/categories"), 2000);
      } else {
        setMessage({ text: data.msg || "Failed to create category", color: "text-rose-500" });
      }
    } catch (error) {
      console.error(error);
      setMessage({ text: "Server connection failed.", color: "text-rose-500" });
    } finally {
      setLoading(false);
    }
  };


  const inputClass = "w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-500 transition";
  const labelClass = "block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1";

  return (
    <PageTransition>
      <DashboardLayout title="Management">
        <div className="flex items-center justify-center">
          <motion.div variants={scaleIn} initial="hidden" animate="visible"
            className="bg-white shadow-sm border border-gray-100 rounded-2xl p-8 w-full max-w-xl">
            <h2 className="text-2xl font-semibold text-gray-800 text-center mb-8">Create New Category</h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className={labelClass}>Category Title *</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} />
              </div>

              <MessageBanner message={message} />

              <motion.button type="submit" disabled={loading} whileHover={{ backgroundColor: "#1f2937" }} whileTap={{ scale: 0.98 }}
                className="w-full bg-black text-white py-4 rounded-xl text-xs font-bold uppercase tracking-[0.2em] cursor-pointer disabled:opacity-60">
                {loading ? "Creating..." : "Create Product Category"}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </DashboardLayout>
    </PageTransition>
  );
}