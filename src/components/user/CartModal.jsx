import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useCart } from "../../context/CartContext";
import { parsePrice, formatNaira } from "../../lib/format";

export default function CartModal({ product, image, onClose }) {
  const { cart } = useCart();
  const total = cart.reduce((acc, item) => acc + parsePrice(item.price) * item.quantity, 0);

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white w-[90%] max-w-5xl rounded-md shadow-lg relative p-6"
        initial={{ opacity: 0, scale: 0.92, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 30 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <motion.button
          onClick={onClose}
          whileHover={{ scale: 1.2, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          transition={{ duration: 0.2 }}
          className="absolute top-4 right-4 text-gray-500 hover:text-black cursor-pointer text-xl"
        >✕</motion.button>

        <h2 className="text-center text-xl tracking-wide text-gray-600 mb-6">
          OK, 1 ITEM WAS ADDED TO YOUR CART. WHAT'S NEXT?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <img src={image} alt={product.title} className="w-full h-full object-cover" />
          </motion.div>

          <motion.div className="space-y-2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <h3 className="text-2xl font-semibold uppercase">{product.title}</h3>
            <p className="text-sm text-gray-500 uppercase tracking-wide">Saffron & Sage</p>
            <p className="text-sm text-gray-600">1 × {formatNaira(product.price)}</p>
          </motion.div>

          <motion.div className="space-y-4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <motion.div whileHover={{ scale: 1.01 }}>
              <Link to="/checkout" className="block w-full bg-black text-white py-3 text-center text-sm uppercase tracking-wide hover:bg-gray-800 transition">
                Proceed to Checkout
              </Link>
            </motion.div>
            <div className="text-sm text-gray-600">
              <p>Order subtotal</p>
              <p className="text-lg font-bold">{formatNaira(total)}</p>
              <p className="text-xs mt-1">Your cart contains {cart.length} item(s)</p>
            </div>
            <motion.div whileHover={{ scale: 1.01 }}>
              <Link to="/shop" onClick={onClose}
                className="block w-full border border-black py-3 text-center text-sm uppercase hover:bg-black hover:text-white transition">
                Continue Shopping
              </Link>
            </motion.div>
            <Link to="/cart" onClick={onClose} className="block w-full text-center text-xs text-gray-500 underline">
              View or edit your cart
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}