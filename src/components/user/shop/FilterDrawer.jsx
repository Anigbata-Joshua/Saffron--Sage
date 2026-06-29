// Mobile slide-out drawer wrapping FilterSidebar. Shown on small screens;
// desktop uses the inline sidebar instead.

import { motion } from "framer-motion";

export default function FilterDrawer({ open, onClose, children }) {
  if (!open) return null;
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black z-50 lg:hidden"
      />
      <motion.aside
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        exit={{ x: "-100%" }}
        transition={{ type: "tween", duration: 0.3 }}
        className="fixed top-0 left-0 bottom-0 w-[85%] sm:w-[380px] bg-white z-50 p-6 shadow-2xl overflow-y-auto lg:hidden"
      >
        <div className="flex justify-end mb-4">
          <button
            onClick={onClose}
            aria-label="Close filters"
            className="text-2xl text-stone-800 w-10 h-10 flex items-center justify-center rounded-full bg-stone-50"
          >
            <i className="ri-close-line"></i>
          </button>
        </div>
        {children}
      </motion.aside>
    </>
  );
}