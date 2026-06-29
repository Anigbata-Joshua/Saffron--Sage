// Reusable product tile. Used by Shop, ViewProducts, and any future surface.
// Hover: lifts slightly, image scales subtly
// Click: routes to /product/:id

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { formatPriceString } from "../../lib/format";

export default function ProductCard({ product, badge, className = "" }) {
  if (!product) return null;
  const image = product.image || product.images;
  
const categoryName = product.category?.name || product.category;

  const badgeText = badge || categoryName || "Saffron & Sage";

  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={`bg-white group transition-all ${className}`}
    >
      <div className="relative overflow-hidden aspect-[3/4] bg-stone-50">
        <Link to={`/product/${product.id}`}>
          <motion.img
            src={image}
            alt={product.title}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.4 }}
          />
        </Link>
        <div className="absolute inset-0 items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none hidden sm:flex">
          <span className="bg-white/95 px-5 py-3 text-[10px] tracking-[0.3em] uppercase font-semibold shadow-sm border border-stone-100">
            Quick View
          </span>
        </div>
      </div>

      <div className="mt-4 space-y-1 px-1">
        <span className="inline-block mb-1.5 bg-stone-100 text-stone-600 text-[9px] font-bold px-2.5 py-0.5 tracking-widest uppercase rounded-sm">
          {badgeText}
        </span>
        <h4 className="text-[13px] font-serif text-stone-800 leading-tight h-9 overflow-hidden font-normal group-hover:text-stone-600 transition-colors">
          {product.title}
        </h4>
        <div className="pt-0.5 font-semibold text-[13px] text-stone-900 tracking-wider">
          {formatPriceString(product.price)}
        </div>
      </div>
    </motion.div>
  );
}