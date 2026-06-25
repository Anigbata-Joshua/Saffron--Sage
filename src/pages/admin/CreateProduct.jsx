import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "../../components/admin/DashboardLayout";
import PageTransition from "../../components/PageTransition";
import { api } from "../../services/api";
import { auth } from "../../services/auth";
import { scaleIn, staggerContainer, staggerItem } from "../../animations";

export default function CreateProduct() {
  const merchantId = auth.getMerchantId();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ title: "", descp: "", price: "", quantity: "", image: "", category_id: "" });
  const [message, setMessage] = useState({ text: "", color: "" });
  const [loading, setLoading] = useState(false);
  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  useEffect(() => {
    if (!merchantId) return;
    api.get(`/categories?merchant_id=${merchantId}`).then((d) => setCategories(Array.isArray(d) ? d : [])).catch(console.error);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.price || !form.category_id) { setMessage({ text: "Please fill in all required fields.", color: "text-red-500" }); return; }
    setLoading(true); setMessage({ text: "Creating product...", color: "text-gray-500" });
    try {
      await api.post("/products", { merchant_id: merchantId, title: form.title, descp: form.descp, price: Number(form.price), quantity: Number(form.quantity), images: form.image, category_id: form.category_id, currency: "NGN" });
      setMessage({ text: "Product Created Successfully!", color: "text-green-500" });
      setForm({ title: "", descp: "", price: "", quantity: "", image: "", category_id: "" });
    } catch { setMessage({ text: "Failed to create product.", color: "text-red-500" }); }
    finally { setLoading(false); }
  };

  const inputClass = "w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-500 transition";
  const labelClass = "block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1";

  return (
    <PageTransition>
      <DashboardLayout title="Management">
        <div className="flex items-center justify-center">
          <motion.div variants={scaleIn} initial="hidden" animate="visible"
            className="bg-white shadow-sm border border-gray-100 rounded-2xl p-8 w-full max-w-xl">
            <h2 className="text-2xl font-semibold text-gray-800 text-center mb-8">Create New Product</h2>
            <motion.form onSubmit={handleSubmit} className="space-y-5" variants={staggerContainer} initial="hidden" animate="visible">
              {[
                { label: "Product Title *", field: "title", type: "text" },
                { label: "Image URL", field: "image", type: "text" },
              ].map(({ label, field, type }) => (
                <motion.div key={field} variants={staggerItem}>
                  <label className={labelClass}>{label}</label>
                  <input type={type} value={form[field]} onChange={update(field)} className={inputClass} />
                </motion.div>
              ))}
              <motion.div variants={staggerItem}>
                <label className={labelClass}>Description</label>
                <textarea rows="3" value={form.descp} onChange={update("descp")} className={inputClass} />
              </motion.div>
              <motion.div variants={staggerItem} className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Price (₦) *</label>
                  <input type="number" value={form.price} onChange={update("price")} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Quantity</label>
                  <input type="number" value={form.quantity} onChange={update("quantity")} className={inputClass} />
                </div>
              </motion.div>
              <motion.div variants={staggerItem}>
                <label className={labelClass}>Category *</label>
                <select value={form.category_id} onChange={update("category_id")} className={`${inputClass} bg-white cursor-pointer`}>
                  <option value="">Select Category</option>
                  {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name.toUpperCase()}</option>)}
                </select>
              </motion.div>
              <motion.button type="submit" disabled={loading} whileHover={{ backgroundColor: "#1f2937" }} whileTap={{ scale: 0.98 }}
                className="w-full bg-black text-white py-4 rounded-xl text-xs font-bold uppercase tracking-[0.2em] cursor-pointer disabled:opacity-60">
                {loading ? "Creating..." : "Create Product"}
              </motion.button>
            </motion.form>
            {message.text && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                className={`mt-6 text-center text-[10px] uppercase tracking-widest font-medium ${message.color}`}>{message.text}</motion.div>
            )}
          </motion.div>
        </div>
      </DashboardLayout>
    </PageTransition>
  );
}
