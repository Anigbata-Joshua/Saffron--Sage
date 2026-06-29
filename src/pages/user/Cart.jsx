import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../../components/user/Navbar";
import Footer from "../../components/user/Footer";
import PageTransition from "../../components/PageTransition";
import { useCart } from "../../context/CartContext";
import EmptyState from "../../components/ui/EmptyState";
import { parsePrice, formatNaira } from "../../lib/format";
import { fadeUp, staggerContainer, staggerItem } from "../../animations";

const alsoLike = [
  { 
    img: new URL("../../images/4_campaign__14713.jpg", import.meta.url).href, 
    name: "Tie Waist Maxi Dress in Blue", 
    price: "₦260,000" 
  },
  { 
    img: new URL("../../images/4th cart.1.jpg", import.meta.url).href, 
    name: "Fruito Yolk Blouse in Yellow", 
    price: "₦189,800" 
  },
  { 
    img: new URL("../../images/product3.jpg", import.meta.url).href, 
    name: "Fruito Bib Smock Dress in Blush", 
    price: "₦189,800" 
  },
  { 
    img: new URL("../../images/product3.jpg", import.meta.url).href, 
    name: "Fruito Bib Smock Dress in Blush", 
    price: "₦189,800" 
  },
];

export default function Cart() {
  const { cart, increaseQty, decreaseQty, removeFromCart } = useCart();

  const grandTotal = cart.reduce((acc, item) => acc + parsePrice(item.price) * item.quantity, 0);

  return (
    <PageTransition>
      <div className="bg-white min-h-screen">
        <Navbar />
        <div className="relative bg-[#FDFCFB] py-8 sm:py-16">
  {cart.length === 0 ? (
    <motion.div 
      className="text-center py-20 px-4 max-w-md mx-auto flex flex-col items-center justify-center gap-6" 
      variants={fadeUp} 
      initial="hidden" 
      animate="visible"
    >
      <EmptyState 
        title="Your cart is currently empty." 
        message="Add products to your cart to review your selections here." 
      />
      <Link 
        to="/shop" 
        className="inline-block border-b border-stone-900 pb-1 text-xs uppercase tracking-widest font-semibold text-stone-900 hover:text-stone-500 hover:border-stone-400 transition-colors mt-2"
      >
        Continue Shopping
      </Link>
    </motion.div>
  ) : (
    <motion.div 
      className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8" 
      variants={fadeUp} 
      initial="hidden" 
      animate="visible"
    >
      {/* HORIZONTAL SCROLL OVERLAY */}
      <div className="overflow-x-auto w-full border-b border-stone-200/80 no-scrollbar">
        <table className="w-full border-collapse min-w-[800px]">
          <thead>
            <tr className="text-left text-[10px] font-bold uppercase tracking-widest text-stone-400 border-b border-stone-200">
              <th className="py-5 font-bold">Product</th>
              <th className="py-5 font-bold">Price</th>
              <th className="py-5 font-bold text-center">Quantity</th>
              <th className="py-5 font-bold text-right pr-4">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            <AnimatePresence mode="popLayout">
              {cart.map((item) => {
                const numericPrice = parsePrice(item.price);
                const itemTotal = numericPrice * item.quantity;
                return (
                  <motion.tr
                    key={item.id ?? item._id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 30, transition: { duration: 0.2 } }}
                    className="hover:bg-stone-50/40 transition-colors group"
                  >
                    {/* Image & Title Info */}
                    <td className="py-6 pr-6">
                      <div className="flex gap-4 sm:gap-6 items-center">
                        <div className="overflow-hidden bg-stone-100 shadow-sm shrink-0 aspect-[3/4] w-16 sm:w-20 rounded-sm border border-stone-200/40">
                          <img 
                            src={item.image} 
                            alt={item.title} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                          />
                        </div>
                        <div className="space-y-1.5">
                          <span className="block text-[9px] font-bold tracking-widest text-stone-400 uppercase">
                            Saffron & Sage
                          </span>
                          <p className="font-serif text-sm sm:text-base text-stone-900 font-normal leading-tight max-w-[220px] sm:max-w-xs break-words">
                            {item.title}
                          </p>
                          {item.size !== null && (
                            <span className="inline-block text-[10px] text-stone-500 bg-stone-100/80 px-2 py-0.5 font-medium tracking-wide">
                              Size {item.size}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Unit Price */}
                    <td className="text-stone-600 text-xs sm:text-sm font-medium whitespace-nowrap">
                      {formatNaira(item.price)}
                    </td>

                    {/* Quantity Adjustments */}
                    <td className="px-2">
                      <div className="flex items-center justify-center border border-stone-200 w-max mx-auto bg-white shadow-sm">
                        <motion.button 
                          whileTap={{ scale: 0.9 }} 
                          onClick={() => decreaseQty(item.id ?? item._id)}
                          className="w-8 h-8 cursor-pointer text-sm flex items-center justify-center text-stone-500 hover:text-stone-900 transition-colors focus:outline-none"
                        >
                          ✕
                        </motion.button>
                        <span className="px-2 text-xs font-semibold min-w-[28px] text-center text-stone-800">
                          {item.quantity}
                        </span>
                        <motion.button 
                          whileTap={{ scale: 0.9 }} 
                          onClick={() => increaseQty(item.id ?? item._id)}
                          className="w-8 h-8 cursor-pointer text-sm flex items-center justify-center text-stone-500 hover:text-stone-900 transition-colors focus:outline-none"
                        >
                          ＋
                        </motion.button>
                      </div>
                    </td>

                    {/* Line Totals & Actions */}
                    <td className="text-right text-stone-900 text-xs sm:text-sm font-semibold whitespace-nowrap pr-4">
                      <div className="flex items-center justify-end gap-4">
                        <span>{formatNaira(itemTotal)}</span>
                        <motion.button 
                          whileHover={{ scale: 1.15, color: "#ef4444" }} 
                          whileTap={{ scale: 0.95 }}
                          onClick={() => { if (confirm("Remove this item from your cart?")) removeFromCart(item.id ?? item._id); }}
                          className="text-stone-400 cursor-pointer p-1 text-sm flex items-center justify-center transition-colors focus:outline-none"
                          aria-label="Remove item"
                        >
                          <i className="ri-delete-bin-line text-base"></i>
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* CHECKOUT SUMMARY PANEL */}
      <motion.div className="mt-10 flex justify-end" layout>
        <div className="w-full sm:w-[360px] space-y-5 pt-2">
          <div className="flex justify-between items-baseline border-b border-stone-100 pb-4">
            <span className="text-[11px] font-bold uppercase tracking-widest text-stone-400">
              Subtotal
            </span>
            <motion.span
              key={grandTotal}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-serif text-xl font-normal text-stone-950 tracking-wide"
            >
              {formatNaira(grandTotal)}
            </motion.span>
          </div>
          
          <p className="text-right text-stone-400 text-[11px] font-light italic leading-normal">
            Shipping and discount options calculated during checkout.
          </p>

          <Link
            to="/checkout"
            className="block bg-stone-950 text-white py-4 px-8 uppercase text-[11px] font-bold tracking-[0.2em] w-full transition-all duration-300 hover:bg-stone-800 text-center shadow-sm hover:shadow-md"
          >
            Proceed to Checkout
          </Link>
        </div>
      </motion.div>
    </motion.div>
  )}
</div>

        {/* SUGGESTIONS CAROUSEL SECTION */}
        <div className="w-[90%] sm:w-[85%] max-w-6xl mx-auto mt-12 sm:mt-16 mb-16 sm:mb-24">
          <motion.h4 className="text-2xl sm:text-3xl lg:text-4xl font-light text-gray-400 mb-8 sm:mb-12" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            You May Also Like
          </motion.h4>

          {/* GRID CONFIG: Starts 2-column wide on mobile up to 4-column wide on desktop viewports */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {alsoLike.map((p) => (
              <motion.div key={p.id} variants={staggerItem} whileHover={{ y: -4, transition: { duration: 0.2 } }} className="flex flex-col h-full">
                <div className="relative group cursor-pointer overflow-hidden aspect-[3/4] bg-stone-50">
                  <img src={p.img} alt={p.name} className="w-full h-full object-cover" />
                  {/* Quick view mask drops off on pointerless touch platforms to conserve gestures */}
                  <div className="hidden lg:flex absolute inset-0 items-center justify-center opacity-0 group-hover:opacity-100 z-20 transition-opacity bg-black/5 backdrop-blur-[1px]">
                    <h3 className="text-black text-[11px] tracking-[0.25em] uppercase font-medium bg-white/90 shadow-sm py-3 px-5 transition hover:bg-white">Quick View</h3>
                  </div>
                </div>
                <div className="mt-3 text-[#272727] flex flex-col flex-1 justify-between">
                  <div>
                    {p.badge && <h2 className="bg-stone-100 text-stone-600 text-[8px] font-bold tracking-widest w-max py-0.5 px-2 mb-1.5 uppercase">NATURAL FIBRE</h2>}
                    <h4 className="text-[10px] uppercase tracking-wide font-bold line-clamp-2 min-h-[20px]">{p.name}</h4>
                  </div>
                  <div className="mt-1 flex gap-2 font-medium items-center">
                    {p.original && <p className="line-through text-[9px] text-stone-400 font-bold">{p.original}</p>}
                    <span className="text-[10px] font-bold text-stone-900">{p.price}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <Footer />
      </div>
    </PageTransition>
  );
}
