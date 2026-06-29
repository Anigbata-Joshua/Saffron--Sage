// /checkout
// Collects customer details + delivery method, then either:
//   • places the order via email (mailto: link with subject + body), OR
//   • sends the order via WhatsApp (wa.me link with full message).
// Either way, an order record is persisted to localStorage and the cart is
// cleared before showing the confirmation screen.

import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../../components/user/Navbar";
import Footer from "../../components/user/Footer";
import PageTransition from "../../components/PageTransition";
import { useCart } from "../../context/CartContext";
import { formatNaira, parsePrice } from "../../lib/format";
import {
  buildOrderLines,
  buildOrderTotal,
  persistOrder,
  placeOrderByEmail,
  placeOrderByWhatsApp,
} from "../../lib/checkout";
import { fadeUp, staggerContainer, staggerItem } from "../../animations";

const DELIVERY_OPTIONS = [
  { id: "standard", label: "Standard Delivery (3–5 business days)", fee: 0 },
  { id: "express", label: "Express Delivery (1–2 business days)", fee: 4500 },
];

const BUSINESS_WHATSAPP = "+2348000000000"; // merchant's WhatsApp — falls back to customer phone if blank

const initialForm = { fullName: "", email: "", phone: "", address: "", city: "" };

export default function Checkout() {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [delivery, setDelivery] = useState("standard");
  const [channel, setChannel] = useState("email"); // "email" | "whatsapp"
  const [errors, setErrors] = useState({});
  const [confirmation, setConfirmation] = useState(null);

  const lines = useMemo(() => buildOrderLines(cart), [cart]);
  const subtotal = useMemo(() => buildOrderTotal(cart), [cart]);
  const deliveryFee = DELIVERY_OPTIONS.find((o) => o.id === delivery)?.fee ?? 0;
  const total = subtotal + deliveryFee;

  const update = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!form.fullName.trim()) next.fullName = "Required.";
    if (!form.email.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) next.email = "Enter a valid email.";
    if (!form.phone.trim() || form.phone.replace(/\D/g, "").length < 7) next.phone = "Enter a valid phone.";
    if (!form.address.trim()) next.address = "Required.";
    if (!form.city.trim()) next.city = "Required.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (cart.length === 0) return;
    if (!validate()) return;

    const order = persistOrder({ cart, customer: form, delivery, channel });
    if (channel === "email") {
      placeOrderByEmail({ cart, customer: form, delivery, order });
    } else {
      placeOrderByWhatsApp({
        cart,
        customer: form,
        delivery,
        order,
        businessPhone: BUSINESS_WHATSAPP,
      });
    }
    clearCart();
    setConfirmation(order);
  };

  // Success screen
  if (confirmation) {
    return (
      <PageTransition>
        <div className="bg-white min-h-screen">
          <Navbar />
          <div className="max-w-2xl mx-auto px-6 py-24 text-center">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.4 }}>
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center text-3xl">
                ✓
              </div>
              <h1 className="mt-6 text-2xl md:text-3xl font-light tracking-wide text-stone-900">
                Order placed!
              </h1>
              <p className="mt-3 text-sm text-stone-500">
                We've sent the order summary to {channel === "email" ? "your email" : "WhatsApp"}.
                Reference: <span className="font-mono text-stone-800">{confirmation.id}</span>
              </p>
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                {confirmation.items.map((line, i) => (
                  <div key={i} className="border border-stone-100 p-4 bg-stone-50/50">
                    <div className="text-[11px] uppercase tracking-widest text-stone-500">
                      ×{line.quantity}
                    </div>
                    <div className="text-sm text-stone-800 mt-1">{line.title}</div>
                    <div className="text-sm font-semibold mt-2">{formatNaira(line.lineTotal)}</div>
                  </div>
                ))}
              </div>
              <div className="mt-8 text-sm text-stone-700 flex justify-between border-t border-stone-200 pt-4">
                <span className="uppercase tracking-widest text-[11px] text-stone-500">Total</span>
                <span className="font-semibold">{formatNaira(confirmation.total)}</span>
              </div>
              <Link
                to="/shop"
                className="inline-block mt-10 px-8 py-3 bg-stone-900 text-white text-[11px] tracking-widest uppercase font-semibold hover:bg-black transition-colors"
              >
                Continue Shopping
              </Link>
            </motion.div>
          </div>
          <Footer />
        </div>
      </PageTransition>
    );
  }

  if (cart.length === 0) {
    return (
      <PageTransition>
        <div className="bg-white min-h-screen">
          <Navbar />
          <div className="max-w-md mx-auto px-6 py-24 text-center">
            <h1 className="text-2xl font-light text-stone-800">Your cart is empty</h1>
            <p className="mt-3 text-sm text-stone-500">
              Add something to your cart before checking out.
            </p>
            <button
              onClick={() => navigate("/shop")}
              className="mt-8 px-8 py-3 bg-stone-900 text-white text-[11px] tracking-widest uppercase font-semibold hover:bg-black transition-colors"
            >
              Go to Shop
            </button>
          </div>
          <Footer />
        </div>
      </PageTransition>
    );
  }

  const inputClass =
    "w-full px-4 py-3 border border-stone-200 rounded text-sm outline-none focus:border-stone-700 transition bg-white";
  const labelClass =
    "block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1.5";

  return (
    <PageTransition>
      <div className="bg-white min-h-screen">
        <Navbar />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
          <motion.h1
            className="text-2xl md:text-3xl font-light tracking-wide text-stone-900 mb-8"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Checkout
          </motion.h1>

          <motion.form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 lg:grid-cols-3 gap-10"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {/* Left: form */}
            <div className="lg:col-span-2 space-y-8">
              <motion.section variants={staggerItem}>
                <h2 className="text-[11px] uppercase tracking-[0.25em] font-bold text-stone-900 mb-4">
                  Contact details
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { field: "fullName", label: "Full Name", placeholder: "Jane Smith" },
                    { field: "email", label: "Email", placeholder: "jane@example.com", type: "email" },
                    { field: "phone", label: "Phone (with country code)", placeholder: "+234 800 000 0000" },
                    { field: "city", label: "City", placeholder: "Lagos" },
                  ].map(({ field, label, placeholder, type = "text" }) => (
                    <div key={field}>
                      <label className={labelClass}>{label}</label>
                      <input
                        type={type}
                        value={form[field]}
                        onChange={update(field)}
                        placeholder={placeholder}
                        className={inputClass}
                      />
                      {errors[field] && (
                        <p className="text-[10px] text-rose-500 mt-1 uppercase tracking-widest">{errors[field]}</p>
                      )}
                    </div>
                  ))}
                </div>
              </motion.section>

              <motion.section variants={staggerItem}>
                <h2 className="text-[11px] uppercase tracking-[0.25em] font-bold text-stone-900 mb-4">
                  Shipping address
                </h2>
                <label className={labelClass}>Street address</label>
                <input
                  type="text"
                  value={form.address}
                  onChange={update("address")}
                  placeholder="12 Banana Island Road"
                  className={inputClass}
                />
                {errors.address && (
                  <p className="text-[10px] text-rose-500 mt-1 uppercase tracking-widest">{errors.address}</p>
                )}
              </motion.section>

              <motion.section variants={staggerItem}>
                <h2 className="text-[11px] uppercase tracking-[0.25em] font-bold text-stone-900 mb-4">
                  Delivery
                </h2>
                <div className="space-y-2">
                  {DELIVERY_OPTIONS.map((opt) => (
                    <label
                      key={opt.id}
                      className={`flex items-center justify-between border px-4 py-3 cursor-pointer transition ${
                        delivery === opt.id ? "border-stone-900 bg-stone-50" : "border-stone-200 hover:border-stone-400"
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="delivery"
                          checked={delivery === opt.id}
                          onChange={() => setDelivery(opt.id)}
                          className="w-4 h-4 accent-stone-800"
                        />
                        <span className="text-sm text-stone-800">{opt.label}</span>
                      </span>
                      <span className="text-sm font-semibold">
                        {opt.fee === 0 ? "Free" : formatNaira(opt.fee)}
                      </span>
                    </label>
                  ))}
                </div>
              </motion.section>

              <motion.section variants={staggerItem}>
                <h2 className="text-[11px] uppercase tracking-[0.25em] font-bold text-stone-900 mb-4">
                  How would you like to receive your order?
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { id: "email", icon: "✉", title: "Email me", desc: "We'll email a full invoice to your address." },
                    { id: "whatsapp", icon: "🟢", title: "WhatsApp me", desc: "We'll send the order summary to your phone." },
                  ].map((opt) => (
                    <label
                      key={opt.id}
                      className={`flex items-start gap-3 border px-4 py-4 cursor-pointer transition ${
                        channel === opt.id ? "border-stone-900 bg-stone-50" : "border-stone-200 hover:border-stone-400"
                      }`}
                    >
                      <input
                        type="radio"
                        name="channel"
                        checked={channel === opt.id}
                        onChange={() => setChannel(opt.id)}
                        className="mt-1 w-4 h-4 accent-stone-800"
                      />
                      <span>
                        <span className="block text-sm font-semibold text-stone-900">
                          <span className="mr-2">{opt.icon}</span>
                          {opt.title}
                        </span>
                        <span className="block text-xs text-stone-500 mt-1">{opt.desc}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </motion.section>
            </div>

            {/* Right: summary */}
            <motion.aside variants={fadeUp} className="lg:col-span-1">
              <div className="bg-stone-50 border border-stone-200 p-6 sticky top-28">
                <h2 className="text-[11px] uppercase tracking-[0.25em] font-bold text-stone-900 mb-4">
                  Order summary
                </h2>
                <ul className="divide-y divide-stone-200 mb-4">
                  {lines.map((l, i) => (
                    <li key={i} className="py-3 flex justify-between items-start gap-3">
                      <div className="text-sm text-stone-700">
                        <span className="block leading-tight">{l.title}</span>
                        <span className="text-[11px] text-stone-400 uppercase tracking-widest">
                          ×{l.quantity}
                        </span>
                      </div>
                      <span className="text-sm font-semibold whitespace-nowrap">
                        {formatNaira(l.lineTotal)}
                      </span>
                    </li>
                  ))}
                </ul>

                <dl className="space-y-2 text-sm border-t border-stone-200 pt-4">
                  <div className="flex justify-between">
                    <dt className="text-stone-500">Subtotal</dt>
                    <dd>{formatNaira(subtotal)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-stone-500">Delivery</dt>
                    <dd>{deliveryFee === 0 ? "Free" : formatNaira(deliveryFee)}</dd>
                  </div>
                  <div className="flex justify-between font-semibold text-base pt-2 border-t border-stone-200">
                    <dt>Total</dt>
                    <dd>{formatNaira(total)}</dd>
                  </div>
                </dl>

                <motion.button
                  type="submit"
                  whileHover={{ backgroundColor: "#000" }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-6 w-full bg-stone-900 text-white py-3.5 text-[11px] tracking-widest uppercase font-semibold cursor-pointer"
                >
                  Place order via {channel === "email" ? "Email" : "WhatsApp"}
                </motion.button>

                <p className="text-[10px] text-stone-400 mt-3 text-center uppercase tracking-widest">
                  By placing this order you agree to our terms.
                </p>
              </div>
            </motion.aside>
          </motion.form>
        </div>

        <Footer />
      </div>
    </PageTransition>
  );
}