import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import DashboardLayout from "../../components/admin/DashboardLayout";
import PageTransition from "../../components/PageTransition";
import { api } from "../../services/api";
import { auth } from "../../services/auth";
import { scaleIn, staggerContainer, staggerItem } from "../../animations";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

export default function CreateUser() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ first_name: "", last_name: "", email: "", phone: "", password: "" });
  const [message, setMessage] = useState({ text: "", color: "" });
  const [loading, setLoading] = useState(false);
  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: "", color: "" });
    if (!passwordRegex.test(form.password)) { setMessage({ text: "Password must be 8+ chars with 1 uppercase and 1 number.", color: "text-red-500" }); return; }
    if (!emailRegex.test(form.email)) { setMessage({ text: "Please enter a valid email address.", color: "text-red-500" }); return; }
    setLoading(true);
    try {
      const data = await api.post("/users", { first_name: form.first_name, last_name: form.last_name, email: form.email, phone: form.phone, password: form.password });
      if (data.id) { setMessage({ text: "Account Created! Redirecting...", color: "text-green-500" }); setTimeout(() => navigate("/admin/users"), 1500); }

      else { setMessage({ text: data.msg || "Registration failed.", color: "text-red-500" }); }
    } catch (error) {
      console.error("Reg  Error:", error); // <-- Add this line
      setMessage({ text: "Connection error. Please try again.", color: "text-red-500" });
    }
    finally { setLoading(false); }
  };

  const inputClass = "w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-blue-500 outline-none transition";
  const labelClass = "block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1";
  const fields = [
    { label: "First Name", field: "first_name", type: "text" },
    { label: "Last Name", field: "last_name", type: "text" },
    { label: "Email Address", field: "email", type: "email" },
    { label: "Phone Number", field: "phone", type: "tel" },
    { label: "Security Password", field: "password", type: "password" },
  ];

  return (
    <PageTransition>
      <DashboardLayout title="User Management">
        <div className="flex items-center justify-center">
          <motion.div variants={scaleIn} initial="hidden" animate="visible"
            className="bg-white shadow-sm border border-gray-100 rounded-2xl p-8 w-full max-w-xl">
            <div className="mb-8 text-center">
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.3em] block mb-2">Member Portal</span>
              <h2 className="text-2xl font-semibold text-gray-800">Register New User</h2>
            </div>
            <motion.form onSubmit={handleSubmit} className="space-y-5" variants={staggerContainer} initial="hidden" animate="visible">
              {fields.map(({ label, field, type }) => (
                <motion.div key={field} variants={staggerItem}>
                  <label className={labelClass}>{label}</label>
                  <input type={type} value={form[field]} onChange={update(field)} className={inputClass} required />
                </motion.div>
              ))}
              <motion.button type="submit" disabled={loading} whileHover={{ backgroundColor: "#1f2937" }} whileTap={{ scale: 0.98 }}
                className="w-full bg-black text-white py-4 rounded-xl text-xs font-bold uppercase tracking-[0.2em] cursor-pointer disabled:opacity-60">
                {loading ? "Creating..." : "Create User Account"}
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
