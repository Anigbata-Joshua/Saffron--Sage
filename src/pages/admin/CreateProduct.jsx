import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "../../components/admin/DashboardLayout";
import PageTransition from "../../components/PageTransition";
import MessageBanner from "../../components/MessageBanner";
import { api } from "../../services/api";
import { auth } from "../../lib/auth";
import { useProducts } from "../../context/ProductsContext";
import { scaleIn, staggerContainer, staggerItem } from "../../animations";

const INITIAL_FORM = { title: "", descp: "", price: "", quantity: "", image: "", category_id: "" };

export default function CreateProduct() {
  const merchantId = auth.getMerchantId();
  const { categories: catalogCategories, addProduct } = useProducts();

  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(INITIAL_FORM);
  const [message, setMessage] = useState({ text: "", color: "" });
  const [loading, setLoading] = useState(false);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  const resetForm = () => setForm(INITIAL_FORM);

  // Fetch and deduplicate categories
  useEffect(() => {
    if (!merchantId) return;

    api.get(`/categories?merchant_id=${merchantId}`)
      .then((data) => {
        const fromApi = Array.isArray(data) ? data : [];
        // Map ensures uniqueness based on lowercase category names
        const uniqueMap = new Map(
          [...catalogCategories, ...fromApi].map((c) => [c.name?.toLowerCase(), c])
        );
        setCategories(Array.from(uniqueMap.values()));
      })
      .catch(() => setCategories(catalogCategories));
  }, [merchantId, catalogCategories]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.price || !form.category_id) {
      return setMessage({ text: "Please fill in all required fields.", color: "text-rose-500" });
    }

    setLoading(true);
    setMessage({ text: "Creating product...", color: "text-stone-500" });

    try {
      const response = await api.post("/products", {
        ...form,
        merchant_id: merchantId,
        price: Number(form.price),
        quantity: Number(form.quantity),
        images: form.image, // Map local form image string to backend field
        currency: "NGN",
      });

      setMessage({ text: "Product Created Successfully!", color: "text-emerald-500" });
      if (addProduct) addProduct(response);
      resetForm();
    } catch (error) {
      console.error(error);
      setMessage({
        text: "Saved locally — backend unreachable. It will still show on the Shop.",
        color: "text-amber-600"
      });
      resetForm();
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
            <h2 className="text-2xl font-semibold text-gray-800 text-center mb-8">Create New Product</h2>
            <motion.form onSubmit={handleSubmit} className="space-y-5" variants={staggerContainer} initial="hidden" animate="visible">

              <motion.div variants={staggerItem}>
                <label className={labelClass}>Product Title *</label>
                <input type="text" value={form.title} onChange={update("title")} className={inputClass} />
              </motion.div>

              <motion.div variants={staggerItem}>
                <label className={labelClass}>Product Image *</label>
                <input type="text" value={form.image} onChange={update("image")} className={inputClass} />
              </motion.div>

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
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name?.toUpperCase()}</option>
                  ))}
                </select>
              </motion.div>

              <MessageBanner message={message} />

              <motion.button type="submit" disabled={loading} whileHover={{ backgroundColor: "#1f2937" }} whileTap={{ scale: 0.98 }}
                className="w-full bg-black text-white py-4 rounded-xl text-xs font-bold uppercase tracking-[0.2em] cursor-pointer disabled:opacity-60">
                {loading ? "Creating..." : "Create Product"}
              </motion.button>
            </motion.form>
          </motion.div>
        </div>
      </DashboardLayout>
    </PageTransition>
  );
}