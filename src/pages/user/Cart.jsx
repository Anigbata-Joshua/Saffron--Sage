import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../../components/user/Navbar";
import Footer from "../../components/user/Footer";
import PageTransition from "../../components/PageTransition";
import { useCart } from "../../context/CartContext";
import { fadeUp, staggerContainer, staggerItem } from "../../animations";

const alsoLike = [
  { id: 1, img: "./image/5_front_etch__16156.1770040564.jpg", name: "Fruito Bib Smock Dress in Blush", badge: true, original: "₦316,300", price: "₦189,800" },
  { id: 2, img: "./image/2ND CART.1.jpg", name: "Marie Stripe Kaftan Dress in Stripe", badge: true, price: "₦307,300" },
  { id: 3, img: "./image/3RD CART.1.jpg", name: "Swan Short Sleeve Shirt in Mahogany", original: "₦198,300", price: "₦140,100" },
  { id: 4, img: "./image/4th cart.1.jpg", name: "Fruito Bib Smock Dress in Peach", badge: true, original: "₦162,700", price: "₦99,500" },
];

export default function Cart() {
  const { cart, increaseQty, decreaseQty, removeFromCart } = useCart();

  const grandTotal = cart.reduce((acc, item) => {
    const price = Number(String(item.price).replace(/[^0-9.-]+/g, ""));
    return acc + price * item.quantity;
  }, 0);

  return (
  <PageTransition>
  <div className="bg-white min-h-screen">
    <Navbar />

    <div className="relative bg-[#FDFCFB] py-6 sm:py-10">
      {cart.length === 0 ? (
        <motion.div className="text-center py-16 sm:py-20 px-4" variants={fadeUp} initial="hidden" animate="visible">
          <p className="tracking-[0.15em] sm:tracking-[0.2em] uppercase text-black text-lg sm:text-[20px]">
            Your cart is currently empty
          </p>
          <Link to="/shop" className="inline-block mt-6 border-b border-black pb-1 text-xs sm:text-sm uppercase tracking-widest hover:text-stone-600 hover:border-stone-600 transition-colors">
            Continue Shopping
          </Link>
        </motion.div>
      ) : (
        <motion.div className="max-w-6xl mx-auto mt-4 sm:mt-10 px-4 sm:px-6 lg:px-8" variants={fadeUp} initial="hidden" animate="visible">
          
          {/* HORIZONTAL SCROLL OVERLAY - Protects mobile boundaries */}
          <div className="overflow-x-auto w-full border-b border-stone-200">
            <table className="w-full border-collapse min-w-[750px]">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-widest text-black border-b border-stone-200">
                  <th className="py-4 sm:py-6 font-bold">Product</th>
                  <th className="py-4 sm:py-6 font-bold">Price</th>
                  <th className="py-4 sm:py-6 font-bold text-center">Quantity</th>
                  <th className="py-4 sm:py-6 font-bold text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {cart.map((item) => {
                    const numericPrice = Number(String(item.price).replace(/[^0-9.-]+/g, ""));
                    const itemTotal = numericPrice * item.quantity;
                    return (
                      <motion.tr
                        key={item.id}
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 40, transition: { duration: 0.25 } }}
                        className="border-b border-stone-100"
                      >
                        {/* Image & Title Info */}
                        <td className="py-6 sm:py-10 pr-4">
                          <div className="flex gap-4 sm:gap-6 items-center">
                            <img src={item.image} alt={item.title} className="w-16 h-24 sm:w-20 sm:h-28 object-cover shadow-sm shrink-0" />
                            <div className="space-y-1">
                              <h2 className="text-[9px] sm:text-[10px] tracking-widest text-stone-400 uppercase">Saffron & Sage</h2>
                              <p className="font-serif text-sm sm:text-[15px] text-[#B5894F] leading-tight max-w-[200px] sm:max-w-xs break-words">{item.title}</p>
                            </div>
                          </div>
                        </td>
                        
                        {/* Unit Price */}
                        <td className="text-stone-900 text-sm whitespace-nowrap">₦{item.price}</td>
                        
                        {/* Quantity Adjustments */}
                        <td className="px-2">
                          <div className="flex items-center justify-center border border-stone-200 w-max mx-auto bg-white">
                            <motion.button whileTap={{ scale: 0.85 }} onClick={() => decreaseQty(item.id)}
                              className="w-8 h-8 cursor-pointer text-lg flex items-center justify-center text-stone-600 hover:text-black focus:outline-none">−</motion.button>
                            <span className="px-3 text-sm font-medium min-w-[24px] text-center">{item.quantity}</span>
                            <motion.button whileTap={{ scale: 0.85 }} onClick={() => increaseQty(item.id)}
                              className="w-8 h-8 cursor-pointer text-lg flex items-center justify-center text-stone-600 hover:text-black focus:outline-none">+</motion.button>
                          </div>
                        </td>
                        
                        {/* Line Totals & Actions */}
                        <td className="text-right text-stone-900 text-sm whitespace-nowrap">
                          <span>₦{itemTotal.toLocaleString()}</span>
                          <motion.button whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}
                            onClick={() => { if (confirm("Remove this item?")) removeFromCart(item.id); }}
                            className="text-[#B5894F] ml-3 sm:ml-4 cursor-pointer text-2xl sm:text-3xl leading-none align-middle select-none focus:outline-none">×
                          </motion.button>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* CHECKOUT CALCULATION FOOTER PANEL */}
          <motion.div className="mt-8 flex justify-end" layout>
            <div className="w-full sm:w-[350px] space-y-4 pt-4 text-right">
              <div className="flex justify-between items-center px-1">
                <span className="text-[12px] uppercase tracking-widest text-gray-500">Subtotal:</span>
                <motion.span
                  key={grandTotal}
                  initial={{ scale: 1.1, color: "#b5894f" }}
                  animate={{ scale: 1, color: "#292524" }}
                  className="font-semibold text-base"
                >
                  ₦{grandTotal.toLocaleString()}
                </motion.span>
              </div>
              <motion.button
                whileHover={{ backgroundColor: "#292524" }}
                whileTap={{ scale: 0.98 }}
                className="bg-black text-white py-3.5 sm:py-4 px-8 uppercase text-[11px] tracking-widest w-full transition-colors font-medium shadow-md"
              >
                Proceed to Checkout
              </motion.button>
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
