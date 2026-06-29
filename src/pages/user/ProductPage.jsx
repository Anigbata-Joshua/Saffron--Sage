import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../../components/user/Navbar";
import Footer from "../../components/user/Footer";
import CartModal from "../../components/user/CartModal";
import PageTransition from "../../components/PageTransition";
import { api } from "../../services/api";
import { useCart } from "../../context/CartContext";
import { useProducts } from "../../context/ProductsContext";
import { formatPriceString } from "../../lib/format";
import { fadeUp, fadeIn, staggerContainer, staggerItem, slideInLeft, slideInRight } from "../../animations";

const TABS = ["PRODUCT DETAILS", "PRODUCT FEATURES", "PRODUCT SIZING"];
const DETAILS = {
  "PRODUCT DETAILS": `A playful take on effortless dressing, this dress blends bold colour-blocking with a relaxed, easy-wear silhouette.\n\nFeaturing a statement contrast collar with a button placket, grown-on short sleeves, and subtle side splits.\n\nStyle tip: wear true to size for its intended relaxed look, or belt it for a more defined shape.`,
  "PRODUCT FEATURES": `- Intended for a loose fit\n- Midi length\n- Classic large contrast collar with button placket\n- Grown on short sleeves\n- Side split\n- Saffron & Sage embroidered logo\n- 60% Rayon 35% Nylon 5% Spandex\n- Cold hand wash`,
  "PRODUCT SIZING": `MODEL SIZING\n\n- Charlotte's height is 175cm, 76cm bust, 59cm waist, 86cm hip, wears size 0\n- Mariangel's height is 178cm, 81cm bust, 69cm waist, 92cm hip, wears size 0\n- Mahalia height is 173cm, size 16/18 and wears a size 1`,
};

const RELATED_PRODUCTS = [
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

const NO_IMAGE =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 3 4'><rect width='3' height='4' fill='%23f5f5f4'/><text x='1.5' y='2.2' font-size='0.25' fill='%23a8a29e' text-anchor='middle' font-family='sans-serif'>NO IMAGE</text></svg>";

// Reusable micro-layout wrapper to eliminate redundant frame wrappers
function ProductPageLayout({ children }) {
  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <div className="flex items-center justify-center h-[60vh]">{children}</div>
    </div>
  );
}

export default function ProductPage() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { products: localProducts } = useProducts();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("PRODUCT DETAILS");
  const [showModal, setShowModal] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);

  useEffect(() => {
    const localItem = localProducts.find((p) => String(p.id ?? p._id) === String(id));
    if (localItem) {
      setProduct(localItem);
      setLoading(false);
      return;
    }
    
    setLoading(true);
    api.get(`/products/${id}`)
      .then(setProduct)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id, localProducts]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({ 
      id: product.id ?? product._id, 
      title: product.title, 
      price: product.price, 
      image: product.image ?? product.images ?? NO_IMAGE, 
      size: selectedSize,
      quantity: 1 
    });
    setShowModal(true);
  };

  if (loading) {
    return (
      <ProductPageLayout>
        <motion.p animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5 }}
          className="text-stone-400 uppercase tracking-widest text-xs font-medium">
          Loading product...
        </motion.p>
      </ProductPageLayout>
    );
  }

  if (!product) {
    return (
      <ProductPageLayout>
        <p className="text-stone-400 uppercase tracking-widest text-xs font-medium">Product not found.</p>
      </ProductPageLayout>
    );
  }

  const imagePath = product.image ?? product.images ?? NO_IMAGE;

  return (
    <PageTransition>
      <div className="bg-white">
        <Navbar />
        
        <section className="w-[92%] lg:w-[80%] mx-auto px-2 sm:px-4 mt-6 lg:mt-12">
          {/* Main Product Presentation Grid */}
          <motion.div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start" variants={staggerContainer} initial="hidden" animate="visible">
            
            {/* Left Column: Image Gallery View */}
            <motion.div variants={slideInLeft} className="grid grid-cols-2 gap-2">
              {[imagePath, imagePath].map((src, i) => (
                <div key={i} className="overflow-hidden aspect-[3/4] bg-stone-50">
                  <motion.img src={src} alt={`${product.title} view ${i + 1}`} className="w-full h-full object-cover" whileHover={{ scale: 1.02 }} transition={{ duration: 0.3 }} />
                </div>
              ))}
            </motion.div>

            {/* Right Column: Product Details Content */}
            <motion.div variants={slideInRight} className="space-y-5 lg:pr-6">
              <div className="space-y-1">
                <h1 className="text-xl sm:text-2xl font-normal font-serif tracking-wide text-stone-900 leading-tight">{product.title}</h1>
                <p className="text-stone-400 text-xs tracking-[0.15em] uppercase font-semibold">Saffron & Sage</p>
              </div>

              <p className="text-lg font-semibold text-stone-950 tracking-wider">{formatPriceString(product.price)}</p>

              <div className="flex items-center gap-3 text-xs">
                <span className="text-amber-500">★★★★★</span>
                <span className="text-stone-400 font-medium">(No reviews yet)</span>
              </div>

              <div className="border-b border-stone-100 pb-2">
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} className="px-4 py-2 text-[10px] tracking-widest font-semibold text-stone-700 border border-stone-200 uppercase hover:bg-stone-50 transition-colors">
                  Write a review
                </motion.button>
              </div>

              {/* Sizes Selection */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs uppercase tracking-wider font-semibold text-stone-800">
                  <p>Size: <span className="text-stone-500 font-normal normal-case">{selectedSize !== null ? `Size ${selectedSize}` : "Select size"}</span></p>
                  <a href="#" className="underline text-amber-700 text-[11px] normal-case tracking-normal hover:text-amber-800">Size guide</a>
                </div>

                <div className="flex flex-wrap gap-2">
                  {[0, 1, 2].map((s) => (
                    <button key={s} onClick={() => setSelectedSize(s)}
                      className={`border w-11 h-11 flex items-center justify-center text-xs font-semibold cursor-pointer transition-all ${
                        selectedSize === s ? "border-black bg-black text-white" : "border-stone-200 text-stone-700 hover:border-black hover:bg-stone-50"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 space-y-3">
                <motion.button onClick={handleAddToCart} whileHover={{ backgroundColor: "#1c1917" }} whileTap={{ scale: 0.99 }}
                  className="w-full bg-stone-900 text-white py-4 uppercase text-xs font-semibold tracking-[0.2em] cursor-pointer transition-colors"
                >
                  Add to Cart
                </motion.button>

                <select className="w-full border border-stone-200 p-3.5 text-xs text-stone-600 bg-white uppercase tracking-widest font-medium rounded-none focus:outline-none cursor-pointer">
                  <option>Add to wish list</option>
                  <option>View wish list</option>
                  <option>Create new wish list</option>
                </select>
              </div>
            </motion.div>
          </motion.div>

          {/* Details Accordion Tabs Container */}
          <motion.div className="mt-16 lg:mt-24 w-full lg:w-[65%] mb-16" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div className="flex gap-6 sm:gap-10 border-b border-stone-100 overflow-x-auto no-scrollbar pb-1">
              {TABS.map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`cursor-pointer text-[10px] tracking-[0.15em] font-bold uppercase pb-3 transition-all relative shrink-0 ${
                    activeTab === tab ? "text-black" : "text-stone-400 hover:text-black"
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <motion.div layoutId="activeTabUnderline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
                  )}
                </button>
              ))}
            </div>
            
            <motion.div key={activeTab} variants={fadeIn} initial="hidden" animate="visible" className="mt-6 text-stone-600 text-xs sm:text-[13px] leading-relaxed whitespace-pre-line px-1">
              {DETAILS[activeTab]}
            </motion.div>
          </motion.div>

          {/* Related Items Section */}
          <div className="border-t border-stone-100 pt-12 lg:pt-16">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <h2 className="text-2xl sm:text-3xl text-stone-800 font-light font-serif tracking-wide">You might also like</h2>
            </motion.div>
            
            <motion.div className="grid grid-cols-2 md:grid-cols-4 mt-8 lg:mt-12 mb-20 gap-x-3 gap-y-8 sm:gap-6" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
              {RELATED_PRODUCTS.map((p, i) => (
                <motion.div key={i} variants={staggerItem} whileHover={{ y: -4 }} className="group">
                  <div className="relative cursor-pointer overflow-hidden aspect-[3/4] bg-stone-50">
                    <img src={p.img} alt={p.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]" />
                    <div className="absolute inset-0 items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 bg-black/5 hidden sm:flex">
                      <h3 className="text-black text-xs tracking-[0.2em] uppercase font-semibold bg-white/95 py-3 px-5 border border-stone-100 shadow-sm">Quick View</h3>
                    </div>
                  </div>
                  <div className="mt-4 space-y-1.5 px-0.5">
                    <span className="inline-block bg-stone-100 text-stone-600 text-[9px] font-bold px-2.5 py-0.5 tracking-widest uppercase rounded-sm">NATURAL FIBRE</span>
                    <h4 className="text-xs sm:text-[13px] text-stone-800 uppercase tracking-wide font-medium truncate">{p.name}</h4>
                    <div className="mt-1 flex items-center gap-2 font-semibold text-xs sm:text-[13px]">
                      {p.original && <span className="line-through text-stone-400 font-normal">{p.original}</span>}
                      <span className="text-stone-900 tracking-wider">{p.price}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

        </section>
        
        <Footer />
        {showModal && product && (
          <CartModal product={product} image={imagePath} size={selectedSize} onClose={() => setShowModal(false)} />
        )}
      </div>
    </PageTransition>
  );
}