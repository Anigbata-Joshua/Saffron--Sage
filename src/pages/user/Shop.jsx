import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../../components/user/Navbar";
import Footer from "../../components/user/Footer";
import PageTransition from "../../components/PageTransition";
import { api } from "../../services/api";
import { fadeUp, staggerContainer, staggerItem, slideInLeft } from "../../animations";

const SIZES = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18];
const COLORS = [
  { name: "blue", bg: "bg-blue-500" }, { name: "pink", bg: "bg-pink-400" },
  { name: "neutral", bg: "bg-stone-200" }, { name: "yellow", bg: "bg-amber-400" },
  { name: "black", bg: "bg-black" }, { name: "green", bg: "bg-green-800" },
  { name: "red", bg: "bg-red-700" }, { name: "cyan", bg: "bg-cyan-600" },
  { name: "brown", bg: "bg-red-900" }, { name: "purple", bg: "bg-purple-600" },
];
const FABRICS = ["Cotton", "Viscose", "Cotton Blend", "Polyester", "Linen", "Rayon", "Modal", "Polyester Blend"];

export default function Shop() {
  const merchantId = localStorage.getItem("merchant_id");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  useEffect(() => {
    api.get(`/products?merchant_id=${merchantId}`)
      .then((res) => setProducts(Array.isArray(res) ? res : (res.data || [])))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [merchantId]);

  // Shared inner sidebar content structure used for both Desktop layout & Mobile Drawer view
  const SidebarContent = () => (
    <>
      <h2 className="font-serif text-2xl lg:text-[32px] text-gray-800 mb-6 lg:mb-8 border-b border-stone-200 pb-4 font-light">
        Dresses
      </h2>

      {/* Sizes Filter */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4 mt-6">
          <h3 className="uppercase text-[11px] tracking-[0.2em] font-medium text-gray-800">Sizes</h3>
          <span className="text-black text-sm cursor-pointer">−</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {SIZES.map((s) => (
            <label key={s} className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" className="w-4 h-4 border-stone-300 cursor-pointer rounded-sm" />
              <span className="text-[13px] text-gray-500">{s}</span>
            </label>
          ))}
        </div>
        <div className="border-b border-gray-100 mt-4">
          <p className="text-[11px] text-gray-400 mb-4 mt-4"><a href="#" className="hover:underline">Show more</a></p>
        </div>
      </div>

      {/* Colors Filter */}
      <div className="mb-8 border-t border-gray-100 pt-2">
        <div className="flex justify-between items-center mb-4 mt-4">
          <h3 className="uppercase text-[11px] tracking-[0.2em] font-medium text-gray-800">Colors</h3>
          <span className="text-black text-sm cursor-pointer">−</span>
        </div>
        <div className="grid grid-cols-2 gap-y-3 gap-x-2">
          {COLORS.map(({ name, bg }) => (
            <label key={name} className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" className={`appearance-none w-4 h-4 rounded-full border border-stone-200 ${bg} cursor-pointer checked:ring-2 checked:ring-offset-2 checked:ring-stone-500`} />
              <span className="text-[12px] tracking-widest text-stone-500 capitalize">{name}</span>
            </label>
          ))}
        </div>
        <div className="border-b border-gray-100 mt-4">
          <p className="text-[11px] text-gray-400 mb-4 mt-4"><a href="#" className="hover:underline">Show more</a></p>
        </div>
      </div>

      {/* Fabrics Filter */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4 mt-4">
          <h3 className="uppercase text-[11px] tracking-[0.2em] font-medium text-gray-800">Fabrics</h3>
          <span className="text-black text-sm cursor-pointer">−</span>
        </div>
        <div className="grid grid-cols-1 gap-y-2.5">
          {FABRICS.map((f) => (
            <label key={f} className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" className="accent-stone-800 w-3.5 h-3.5 cursor-pointer rounded-sm" />
              <span className="text-[11px] tracking-[0.1em] text-stone-500 uppercase">{f}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Sorting Rules Filter */}
      <div className="mb-6 border-t border-gray-100 pt-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="uppercase text-[11px] tracking-[0.2em] font-medium text-black">Sort By</h3>
        </div>
        <div className="space-y-2.5">
          {["Newest", "Sustainable", "Price: Ascending", "Price: Descending", "Highest Rated"].map((s) => (
            <label key={s} className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" className="w-4 h-4 accent-stone-800 cursor-pointer" />
              <span className="text-[12px] tracking-widest text-stone-500 uppercase">{s}</span>
            </label>
          ))}
        </div>
      </div>
    </>
  );

  return (
    <PageTransition>
      <div className="bg-white min-h-screen">
        <Navbar />

        {/* Mobile Sticky Filters Action Bar */}
        <div className="lg:hidden sticky top-[64px] z-40 bg-white border-b border-stone-100 px-4 py-3 flex justify-between items-center w-full">
          <button 
            onClick={() => setIsFilterDrawerOpen(true)}
            className="flex items-center gap-2 uppercase tracking-widest text-[11px] font-semibold border border-stone-800 px-4 py-2 hover:bg-stone-50 transition-all"
          >
            <i className="ri-equalizer-line text-xs"></i> Filter & Sort
          </button>
          <div className="text-[11px] uppercase tracking-widest text-stone-400 font-medium">
            {products.length} Items
          </div>
        </div>

        {/* Main Grid View */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-10 w-[92%] lg:w-[85%] mx-auto mt-6 lg:mt-10">

          {/* Large Screen Fixed Sidebar layout */}
          <motion.aside
            className="hidden lg:block lg:col-span-1 border-r border-stone-100 pr-8"
            variants={slideInLeft}
            initial="hidden"
            animate="visible"
          >
            <SidebarContent />
          </motion.aside>

          {/* Interactive Off-canvas Mobile Drawer filter sidebar container */}
          <AnimatePresence>
            {isFilterDrawerOpen && (
              <>
                {/* Backdrop overlay layout click catcher */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsFilterDrawerOpen(false)}
                  className="fixed inset-0 bg-black z-50 lg:hidden"
                />
                {/* Drawer Main Dynamic element wrapper */}
                <motion.aside
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{ type: "tween", duration: 0.3 }}
                  className="fixed top-0 left-0 bottom-0 w-[85%] sm:w-[380px] bg-white z-50 p-6 shadow-2xl overflow-y-auto lg:hidden"
                >
                  <div className="flex justify-end mb-4">
                    <button 
                      onClick={() => setIsFilterDrawerOpen(false)}
                      className="text-2xl text-stone-800 w-10 h-10 flex items-center justify-center rounded-full bg-stone-50"
                    >
                      <i className="ri-close-line"></i>
                    </button>
                  </div>
                  <SidebarContent />
                </motion.aside>
              </>
            )}
          </AnimatePresence>

          {/* Display Main Showcase Products Area Grid */}
          <div className="col-span-1 lg:col-span-4">
            <div className="w-full">
              
              {/* Product Layout Utility View controls line strip */}
              <motion.div
                className="hidden sm:flex justify-end gap-4 mb-6 text-[11px] font-semibold uppercase text-stone-700"
                variants={fadeUp}
                initial="hidden"
                animate="visible"
              >
                <button className="cursor-pointer hover:underline tracking-widest">Product View</button>
                <button className="cursor-pointer hover:underline tracking-widest">Model View</button>
              </motion.div>

              {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-4">
                  {[1,2,3,4,5,6,7,8].map((i) => (
                    <motion.div
                      key={i}
                      className="bg-gray-100 aspect-[3/4] rounded"
                      animate={{ opacity: [0.4, 0.8, 0.4] }}
                      transition={{ repeat: Infinity, duration: 1.4, delay: i * 0.1 }}
                    />
                  ))}
                </div>
              ) : products.length === 0 ? (
                <p className="text-center text-gray-400 py-20 uppercase tracking-widest text-xs font-medium">No products found.</p>
              ) : (
                <motion.div
                  className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-x-3 gap-y-8 lg:gap-x-4 lg:gap-y-12 mb-20"
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                >
                  {products.map((product) => {
                    const formattedPrice = Number(String(product.price).replace(/,/g, "")).toLocaleString();
                    return (
                      <motion.div
                        key={product.id}
                        variants={staggerItem}
                        whileHover={{ y: -4, transition: { duration: 0.2 } }}
                        className="bg-white group transition-all"
                      >
                        <div className="relative overflow-hidden aspect-[3/4] bg-stone-50">
                          <Link to={`/product/${product.id}`}>
                            <motion.img
                              src={product.image}
                              alt={product.title}
                              className="w-full h-full object-cover"
                              whileHover={{ scale: 1.03 }}
                              transition={{ duration: 0.4 }}
                            />
                          </Link>
                          <div className="absolute inset-0  items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none hidden sm:flex">
                            <span className="bg-white/95 px-5 py-3 text-[10px] tracking-[0.3em] uppercase font-semibold shadow-sm border border-stone-100">Quick View</span>
                          </div>
                        </div>
                        
                        <div className="mt-4 space-y-1 px-1">
                          <span className="inline-block mb-1.5 bg-stone-100 text-stone-600 text-[9px] font-bold px-2.5 py-0.5 tracking-widest uppercase rounded-sm">NATURAL FIBRE</span>
                          <h4 className="text-[13px] font-serif text-stone-800 leading-tight h-9 overflow-hidden font-normal group-hover:text-stone-600 transition-colors">{product.title}</h4>
                          <h2 className="text-stone-400 text-[10px] tracking-[0.15em] font-semibold uppercase">Saffron & Sage</h2>
                          <div className="pt-0.5 font-semibold text-[13px] text-stone-900 tracking-wider">₦{formattedPrice}</div>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Dynamic SEO context base branding information wrap container */}
        <motion.div
          className="container w-[92%] lg:w-[85%] mx-auto flex flex-col md:flex-row gap-6 md:gap-12 bg-[#F7F4F0] p-8 md:p-16 mb-16"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="md:w-1/3">
            <h2 className="text-2xl md:text-[32px] font-sans font-light tracking-wide text-black uppercase">DRESSES</h2>
          </div>
          <div className="md:w-2/3">
            <h2 className="text-[#333333] mb-4 font-light text-xl md:text-2xl tracking-wide">DESIGNER DRESSES</h2>
            <p className="text-[#555555] mb-4 text-[13px] md:text-[14px] leading-relaxed font-light">
              Explore our collection of modern designer dresses for every occasion.
            </p>
            <button className="text-[11px] font-semibold text-stone-900 cursor-pointer tracking-widest uppercase underline underline-offset-4 hover:text-stone-600 transition-colors">Read more</button>
          </div>
        </motion.div>

        <Footer />
      </div>
    </PageTransition>
  );
}