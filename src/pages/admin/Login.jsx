import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { api } from "../../services/api";
import { auth } from "../../lib/auth";
import PageTransition from "../../components/PageTransition";
import MessageBanner from "../../components/MessageBanner";
import { slideInLeft, slideInRight, fadeUp } from "../../animations";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState({ text: "", color: "" });
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", color: "" });
    try {
      const data = await api.post("/merchants/login", { email, password });
      if (!data.id) {
        setMessage({ text: "Email or password mismatch.", color: "text-rose-500" });
        return;
      }
      auth.setMerchant(data);
      setMessage({ text: "Login Successful!", color: "text-emerald-500" });
      setTimeout(() => navigate("/admin/dashboard"), 1500);
    } catch (error) {
      console.error("Full Login Error:", error);
      setMessage({ text: "Connection error. Please try again.", color: "text-rose-500" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white font-sans">
        <motion.div
          variants={slideInLeft}
          initial="hidden"
          animate="visible"
          className="hidden lg:flex flex-col justify-center items-center bg-[#1E293B] p-12 text-white relative overflow-hidden"
        >
          <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
          <motion.div
            className="relative z-10 max-w-md text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold mb-6 tracking-tight uppercase">Merchant Portal</h1>
            <p className="text-gray-300 text-lg leading-relaxed mb-8">
              Manage your boutique inventory, track global sales, and monitor performance with our precision-engineered dashboard.
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          variants={slideInRight}
          initial="hidden"
          animate="visible"
          className="flex flex-col justify-center items-center p-8 lg:p-24 bg-white"
        >
          <div className="w-full max-w-sm">
            <motion.div className="mb-10 text-center lg:text-left" variants={fadeUp} initial="hidden" animate="visible">
              <h2 className="text-3xl font-semibold text-[#374151]">Welcome Back</h2>
              <p className="text-gray-500 mt-2">Please enter your merchant credentials</p>
            </motion.div>

            <form onSubmit={handleLogin} className="space-y-6">
              <MessageBanner message={message} />
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Email Address</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="merchant@boutique.com"
                  className="w-full border-b-2 border-gray-100 py-3 outline-none focus:border-[#4F4655] transition-colors text-gray-800 placeholder-gray-300" required />
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full border-b-2 border-gray-100 py-3 outline-none focus:border-[#4F4655] transition-colors text-gray-800 placeholder-gray-300" required />
              </motion.div>
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ backgroundColor: "#4338CA" }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="w-full bg-[#4F46E5] disabled:opacity-60 text-white font-bold py-4 rounded-sm tracking-widest uppercase text-xs shadow-lg shadow-indigo-200 cursor-pointer"
              >
                {loading ? "Signing In..." : "Sign In to Dashboard"}
              </motion.button>
            </form>

            <p className="mt-12 text-center text-gray-400 text-sm">
              Don't have a merchant account?{" "}
              <Link to="/admin/register" className="text-[#374151] font-bold border-b border-gray-300 hover:border-[#374151] transition-all pb-1">
                Apply Now
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
}
