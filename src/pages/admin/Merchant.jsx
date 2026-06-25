import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../../services/api";
import { auth } from "../../services/auth";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export default function Merchant() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    first_name: "", last_name: "", email: "", phone: "",
    store_name: "", shop_description: "", password: "", confirm_password: "",
  });
  const [agreed, setAgreed] = useState(false);
  const [message, setMessage] = useState({ text: "", color: "" });
  const [loading, setLoading] = useState(false);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: "", color: "" });

    if (form.password !== form.confirm_password) {
      setMessage({ text: "Passwords don't match", color: "text-rose-500" });
      return;
    }
    if (!emailRegex.test(form.email)) {
      setMessage({ text: "Please enter a valid email address.", color: "text-rose-500" });
      return;
    }
    if (!agreed) {
      setMessage({ text: "Please agree to the Terms & Conditions.", color: "text-rose-500" });
      return;
    }

    setLoading(true);
    try {
      const data = await api.post("/merchants", {
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        phone: form.phone,
        store_name: form.store_name,
        descp: form.shop_description,
        icon: " ",
        banner: " ",
        phones: [form.phone],
        password: form.password,
      });

      if (data.id) {
        auth.setMerchant({
          id: data.id,
          first_name: form.first_name,
          last_name: form.last_name,
          email: form.email,
          store_name: form.store_name,
        });
        localStorage.setItem("store_name", form.store_name);
        setMessage({ text: "Account Created! Redirecting to Login...", color: "text-green-500" });
        setTimeout(() => navigate("/admin/login"), 1500);
      } else {
        setMessage({ text: data.msg || "Registration failed. Try a different email.", color: "text-rose-500" });
      }
    } catch {
      setMessage({ text: "Server error. Please try again.", color: "text-rose-500" });
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full border-b border-gray-200 py-2 outline-none focus:border-[#4F46E5] transition-colors text-gray-800 placeholder-gray-200";
  const labelClass = "block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1";

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white font-sans">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-center items-center bg-[#1E293B] p-12 text-white relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
        <div className="relative z-10 max-w-md text-center">
          <h1 className="text-4xl font-bold mb-6 tracking-tight uppercase">Merchant Registration</h1>
          <p className="text-gray-300 text-lg leading-relaxed mb-8">
            Start selling to a global audience. Set up your boutique storefront in minutes and manage
            your inventory with precision.
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex flex-col justify-center items-center p-8 lg:p-16 bg-white overflow-y-auto">
        <div className="w-full max-w-lg">
          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-3xl font-semibold text-[#374151]">Create Account</h2>
            <p className="text-gray-500 mt-2 text-sm">Fill in the details to register your boutique</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>First Name</label>
                <input type="text" value={form.first_name} onChange={update("first_name")} className={inputClass} required />
              </div>
              <div>
                <label className={labelClass}>Last Name</label>
                <input type="text" value={form.last_name} onChange={update("last_name")} className={inputClass} required />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Email Address</label>
                <input type="email" value={form.email} onChange={update("email")} placeholder="merchant@boutique.com" className={inputClass} required />
              </div>
              <div>
                <label className={labelClass}>Phone Number</label>
                <input type="tel" value={form.phone} onChange={update("phone")} className={inputClass} />
              </div>
            </div>

            <div>
              <label className={labelClass}>Store Name</label>
              <input type="text" value={form.store_name} onChange={update("store_name")} className={inputClass} required />
            </div>

            <div>
              <label className={labelClass}>Description</label>
              <textarea
                rows="2"
                value={form.shop_description}
                onChange={update("shop_description")}
                placeholder="Tell us about your shop..."
                className={`${inputClass} resize-none`}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Password</label>
                <input type="password" value={form.password} onChange={update("password")} placeholder="••••••••" className={inputClass} required />
              </div>
              <div>
                <label className={labelClass}>Confirm</label>
                <input type="password" value={form.confirm_password} onChange={update("confirm_password")} placeholder="••••••••" className={inputClass} required />
              </div>
            </div>

            <label className="flex items-center gap-3 cursor-pointer mt-4">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="accent-[#4F46E5] h-4 w-4"
              />
              <span className="text-[12px] text-gray-500">
                I agree to the{" "}
                <a href="#" className="text-indigo-600 border-b border-indigo-200">Terms & Conditions</a>
              </span>
            </label>

            {message.text && (
              <div className={`text-xs font-bold uppercase tracking-widest text-center min-h-5 ${message.color}`}>
                {message.text}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#4F46E5] hover:bg-[#4338CA] disabled:opacity-60 text-white font-bold py-4 rounded-sm tracking-[0.2em] uppercase text-xs transition-all shadow-lg shadow-indigo-100 cursor-pointer"
            >
              {loading ? "Creating..." : "Create Merchant Account"}
            </button>
          </form>

          <p className="mt-8 text-center text-gray-400 text-sm">
            Already registered?{" "}
            <Link to="/admin/login" className="text-[#374151] font-bold border-b border-gray-300 hover:border-[#374151] transition-all pb-1 ml-1">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
