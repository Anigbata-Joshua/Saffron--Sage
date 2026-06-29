// Shared animated message banner for admin/user forms.
// Replaces the dozen bespoke {text, color} blocks across Login, Merchant,
// CreateUser, CreateProduct, CreateCategory, Account.

import { AnimatePresence, motion } from "framer-motion";

const COLOR_MAP = {
  "text-red-500": "text-rose-500",
  "text-red-600": "text-rose-600",
  "text-green-500": "text-emerald-500",
  "text-green-600": "text-emerald-600",
  "text-rose-500": "text-rose-500",
  "text-rose-600": "text-rose-600",
  "text-emerald-500": "text-emerald-500",
  "text-emerald-600": "text-emerald-600",
  "text-gray-500": "text-stone-500",
};

export default function MessageBanner({ message, className = "" }) {
  if (!message || !message.text) return null;
  const color = COLOR_MAP[message.color] || message.color || "text-stone-500";
  return (
    <AnimatePresence>
      <motion.p
        key={message.text}
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className={`text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-center ${color} ${className}`}
      >
        {message.text}
      </motion.p>
    </AnimatePresence>
  );
}