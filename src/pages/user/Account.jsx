import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../../components/user/Navbar";
import Footer from "../../components/user/Footer";
import PageTransition from "../../components/PageTransition";
import { api } from "../../services/api";
import { fadeUp, scaleIn } from "../../animations";

export default function Account() {
  const navigate = useNavigate();
  const merchantId = localStorage.getItem("merchant_id");
  const [view, setView] = useState("login");
  const [message, setMessage] = useState({ text: "", color: "" });
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [regForm, setRegForm] = useState({ name: "", email: "", password: "", confirm: "" });

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage({ text: "", color: "" });
    try {
      const data = await api.post("/users/login", {
        email: loginForm.email.trim().toLowerCase(),
        password: loginForm.password,
        merchant_id: merchantId,
      });
      if (data.id) {
        localStorage.setItem("user_id", data.id);
        localStorage.setItem("user_data", JSON.stringify(data));
        setMessage({ text: `WELCOME BACK, ${data.first_name?.toUpperCase()}!`, color: "text-green-600" });
        setTimeout(() => navigate("/"), 1500);
      } else {
        setMessage({ text: "INVALID EMAIL OR PASSWORD.", color: "text-red-500" });
      }
    } catch {
      setMessage({ text: "CONNECTION ERROR.", color: "text-red-500" });
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage({ text: "", color: "" });
    if (regForm.password !== regForm.confirm) {
      setMessage({ text: "PASSWORDS MUST MATCH", color: "text-red-500" });
      return;
    }
    const parts = regForm.name.trim().split(" ");
    try {
      const data = await api.post("/users", {
        first_name: parts[0] || "User",
        last_name: parts[1] || "Customer",
        email: regForm.email.trim().toLowerCase(),
        password: regForm.password,
        phone: "08000000000",
        merchant_id: merchantId,
      });
      if (data.id) {
        setMessage({ text: "SUCCESS! SWITCHING TO LOGIN...", color: "text-green-600" });
        setTimeout(() => setView("login"), 1500);
      } else {
        setMessage({ text: data.msg || "REGISTRATION FAILED.", color: "text-red-500" });
      }
    } catch {
      setMessage({ text: "SERVER ERROR.", color: "text-red-500" });
    }
  };

  const inputClass = "w-full border-b border-gray-200 py-3 outline-none focus:border-black transition-colors text-gray-800 placeholder-gray-300 text-sm";
  const labelClass = "block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2";

  return (
    <PageTransition>
      <div className="bg-white min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center py-20 px-4">
          <motion.div
            variants={scaleIn}
            initial="hidden"
            animate="visible"
            className="bg-white border border-gray-100 shadow-lg rounded-md w-full max-w-md p-10"
          >
            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-8">
              {["login", "register"].map((tab) => (
                <motion.button
                  key={tab}
                  onClick={() => { setView(tab); setMessage({ text: "", color: "" }); }}
                  whileTap={{ scale: 0.97 }}
                  className={`flex-1 py-3 text-[11px] font-bold uppercase tracking-widest transition-colors ${view === tab ? "border-b-2 border-black text-black" : "text-gray-400"}`}
                >
                  {tab === "login" ? "Sign In" : "Create Account"}
                </motion.button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {message.text && (
                <motion.p
                  key={message.text}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`text-[11px] font-bold uppercase tracking-widest mb-4 text-center ${message.color}`}
                >
                  {message.text}
                </motion.p>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {view === "login" ? (
                <motion.form
                  key="login"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleLogin}
                  className="space-y-6"
                >
                  <div>
                    <label className={labelClass}>Email Address</label>
                    <input type="email" value={loginForm.email} onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })} placeholder="you@example.com" className={inputClass} required />
                  </div>
                  <div>
                    <label className={labelClass}>Password</label>
                    <input type="password" value={loginForm.password} onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })} placeholder="••••••••" className={inputClass} required />
                  </div>
                  <motion.button type="submit" whileHover={{ backgroundColor: "#333" }} whileTap={{ scale: 0.98 }}
                    className="w-full bg-black text-white py-4 text-[11px] font-bold uppercase tracking-widest cursor-pointer">
                    Sign In
                  </motion.button>
                </motion.form>
              ) : (
                <motion.form
                  key="register"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleRegister}
                  className="space-y-6"
                >
                  {[
                    { label: "Full Name", type: "text", field: "name", placeholder: "Jane Smith" },
                    { label: "Email Address", type: "email", field: "email", placeholder: "you@example.com" },
                    { label: "Password", type: "password", field: "password", placeholder: "••••••••" },
                    { label: "Confirm Password", type: "password", field: "confirm", placeholder: "••••••••" },
                  ].map(({ label, type, field, placeholder }) => (
                    <div key={field}>
                      <label className={labelClass}>{label}</label>
                      <input type={type} value={regForm[field]} onChange={(e) => setRegForm({ ...regForm, [field]: e.target.value })}
                        placeholder={placeholder} className={inputClass} required />
                    </div>
                  ))}
                  <motion.button type="submit" whileHover={{ backgroundColor: "#333" }} whileTap={{ scale: 0.98 }}
                    className="w-full bg-black text-white py-4 text-[11px] font-bold uppercase tracking-widest cursor-pointer">
                    Create Account
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
        <Footer />
      </div>
    </PageTransition>
  );
}
