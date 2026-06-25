import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import DashboardLayout from "../../components/admin/DashboardLayout";
import PageTransition from "../../components/PageTransition";
import { api } from "../../services/api";
import { auth } from "../../services/auth";
import { scaleIn } from "../../animations";

export default function CreateCategory() {
  const navigate = useNavigate();
  const merchantId = auth.getMerchantId();
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState({ text: "", color: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) { setMessage({ text: "Please enter a category title.", color: "text-red-500" }); return; }
    if (!merchantId) { setMessage({ text: "Error: Merchant ID missing.", color: "text-red-500" }); return; }
    setLoading(true);
    try {
      const data = await api.post("/categories", { name: title.trim(), merchant_id: merchantId, image: "" });
      if (data.id || data._id) {
        setMessage({ text: "Category created successfully! Redirecting...", color: "text-green-500" });
        setTitle("");
        setTimeout(() => navigate("/admin/categories"), 3000);
      } else {
        setMessage({ text: data.msg || "Failed to create category", color: "text-red-500" });
      }
    } catch { setMessage({ text: "Server connection failed.", color: "text-red-500" }); }
    finally { setLoading(false); }
  };

  return (
    <PageTransition>
      <DashboardLayout title="Dashboard">
        <div className="flex items-center justify-center my-10">
          <motion.div variants={scaleIn} initial="hidden" animate="visible"
            className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-xl">
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Create New Category</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Category Title</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border rounded-sm shadow-sm outline-none focus:ring-1 focus:ring-blue-500" />
              </div>
              <motion.button type="submit" disabled={loading} whileHover={{ backgroundColor: "#1f2937" }} whileTap={{ scale: 0.98 }}
                className="w-full bg-black text-white py-3 rounded-lg font-semibold cursor-pointer disabled:opacity-60">
                {loading ? "Creating..." : "Create Product Category"}
              </motion.button>
            </form>
            {message.text && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                className={`mt-4 text-center text-sm font-medium ${message.color}`}>{message.text}</motion.div>
            )}
          </motion.div>
        </div>
      </DashboardLayout>
    </PageTransition>
  );
}
