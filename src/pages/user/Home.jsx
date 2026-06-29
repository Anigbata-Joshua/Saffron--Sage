import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../../components/user/Navbar";
import Footer from "../../components/user/Footer";
import PageTransition from "../../components/PageTransition";
import { fadeUp, fadeIn, staggerContainer, staggerItem, slideInLeft, slideInRight } from "../../animations";

// Import local image assets correctly so they resolve through your build bundle pipeline
import hero from "../../images/hero-banner-march1.png";
import home1 from "../../images/home1.jpg";
import home2 from "../../images/home2.jpg";
import home3 from "../../images/home3.jpg";
import home4 from "../../images/home4.jpg";
import p1Front from "../../images/1_front_etch__15523.jpg";
import p1Hover from "../../images/1_campaign.jpg";
import p2Front from "../../images/2_front_etch__27424.jpg";
import p2Hover from "../../images/2_campaign__34160.jpg";
import p3Front from "../../images/4_front_etch__30987.jpg";
import p3Hover from "../../images/4_campaign__14713.jpg";
import p4Front from "../../images/5_front_etch__16156.1770040564.jpg";
import secondBanner from "../../images/2nd-banner-march1.jpg";
import c1 from "../../images/c1.jpg";
import ct3 from "../../images/ct3.jpg";

// Configured data arrays to cleanly utilize the imported image assets
const featuredProducts = [
  { id: 1, img: p1Front, hover: p1Hover, name: "Fruito Bib Smock Dress in Blush", badge: "NATURAL FIBRE", original: "₦316,300", sale: "₦189,800" },
  { id: 2, img: p2Front, hover: p2Hover, name: "Marie Stripe Kaftan Dress in Stripe", badge: "NATURAL FIBRE", price: "₦307,300" },
  { id: 3, img: p3Front, hover: p3Hover, name: "Swan Short Sleeve Shirt in Mahogany", original: "₦198,300", sale: "₦140,100" },
  { id: 4, img: p4Front, hover: p3Hover, name: "Fruito Bib Smock Dress in Peach", badge: "NATURAL FIBRE", original: "₦162,700", sale: "₦99,500" },
];

const categories = [
  { img: home1, label: "Shop New Arrivals" },
  { img: home2, label: "Shop Dresses" },
  { img: home3, label: "Shop Prints" },
  { img: home4, label: "Shop Separates" },
];

export default function Home() {
  return (
    <PageTransition>
      <div className="bg-white">
        <Navbar />

        {/* Hero Section */}
        <motion.div
          className="relative w-full"
          variants={fadeIn}
          initial="hidden"
          animate="visible"
        >
          <div className="relative h-[80vh] md:h-[90vh] w-full overflow-hidden bg-stone-900">
            {/* Base hero image */}
            <motion.img
              src={hero}
              alt="Hero"
              className="absolute inset-0 w-full h-full object-cover"
              initial={{ scale: 1.08 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.4, ease: "easeOut" }}
            />

            {/* Professional multi-stop gradient overlay */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(115deg, rgba(15,12,8,0.85) 0%, rgba(40,28,20,0.55) 28%, rgba(120,70,40,0.25) 48%, rgba(200,150,90,0.15) 68%, rgba(255,235,210,0.45) 100%)",
              }}
            />

            {/* Soft saffron accent wash (top-right) */}
            <div
              className="absolute inset-0 mix-blend-overlay"
              style={{
                background:
                  "radial-gradient(circle at 85% 18%, rgba(234,144,60,0.55) 0%, rgba(234,144,60,0) 55%)",
              }}
            />

            {/* Sage accent wash (bottom-left) */}
            <div
              className="absolute inset-0 mix-blend-overlay"
              style={{
                background:
                  "radial-gradient(circle at 12% 88%, rgba(112,140,110,0.55) 0%, rgba(112,140,110,0) 60%)",
              }}
            />

            {/* Bottom darkening for legibility */}
            <div
              className="absolute inset-x-0 bottom-0 h-1/3"
              style={{
                background:
                  "linear-gradient(to top, rgba(15,12,8,0.65) 0%, rgba(15,12,8,0) 100%)",
              }}
            />

            {/* Hero Copy & CTA */}
            <div className="relative z-10 h-full flex flex-col justify-end pb-16 md:pb-24 px-6 sm:px-12 lg:px-20">
              <motion.span
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-amber-200 text-[10px] md:text-xs tracking-[0.45em] uppercase font-semibold mb-3"
              >
                The Spring Collection
              </motion.span>
              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.7 }}
                className="text-white font-serif font-light text-3xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05] max-w-3xl"
              >
                Effortless Style,{" "}
                <span
                  className="italic"
                  style={{
                    backgroundImage:
                      "linear-gradient(90deg, #F4D9B5 0%, #E89A4A 50%, #B26A3C 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Crafted in Colour
                </span>
                .
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="text-stone-200/90 text-sm md:text-base font-light max-w-xl mt-4 leading-relaxed"
              >
                Discover Saffron & Sage's signature silhouettes — natural fibres, vibrant palettes and timeless cuts designed for the modern wardrobe.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.85, duration: 0.6 }}
                className="flex flex-wrap gap-3 mt-7"
              >
                <Link
                  to="/shop"
                  className="px-7 py-3 bg-white text-stone-900 text-[11px] tracking-[0.3em] uppercase font-semibold hover:bg-stone-100 transition-colors"
                >
                  Shop the Collection
                </Link>
                <Link
                  to="/shop?category=Classics"
                  className="px-7 py-3 border border-white/70 text-white text-[11px] tracking-[0.3em] uppercase font-semibold hover:bg-white/10 transition-colors"
                >
                  Explore Classics
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Category Grid Section */}
        <div className="w-[90%] mx-auto">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 mt-12 mb-20"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {categories.map(({ img, label }) => (
              <motion.div key={label} variants={staggerItem}>
                <Link to="/shop" className="relative group cursor-pointer overflow-hidden block">
                  <img src={img} alt={label} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10" />
                  <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/50 to-transparent z-20">
                    <h3 className="mt-3 text-white text-[12px] tracking-widest uppercase text-center">{label}</h3>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Featured Products Section */}
        <div className="w-[90%] mx-auto">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 mt-12 mb-20"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {featuredProducts.map((p) => (
              <motion.div key={p.id} variants={staggerItem} whileHover={{ y: -4, transition: { duration: 0.2 } }}>
                <div className="relative group cursor-pointer overflow-hidden aspect-[3/4]">
                  <img src={p.img} alt={p.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                    <img src={p.hover} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                    <h3 className="text-black text-[13px] tracking-[0.25em] uppercase font-medium bg-gray-200 py-[12px] px-[20px]">Quick View</h3>
                  </div>
                </div>
                <div className="mt-4 text-[#272727]">
                  {p.badge && <h2 className="bg-gray-200 text-[12px] w-fit px-3 py-1 mb-1 font-medium">{p.badge}</h2>}
                  <h4 className="text-[10px] uppercase tracking-wide font-bold">{p.name}</h4>
                  <div className="mt-1 flex gap-2 font-medium">
                    {p.original && <p className="line-through text-[10px] font-bold text-gray-400">{p.original}</p>}
                    {p.sale && <span className="text-[10px] font-bold text-red-600">{p.sale}</span>}
                    {p.price && <span className="text-[10px] font-bold">{p.price}</span>}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Second Hero Section */}
        <motion.div
          className="w-[90%] mx-auto mt-4"
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="h-[80vh] md:h-[90vh] w-full overflow-hidden">
            <img src={secondBanner} alt="Banner" className="w-full h-full object-contain cursor-pointer" />
          </div>
        </motion.div>

        {/* Explore More Section */}
        <div className="w-[90%] mx-auto">
          <motion.div
            className="mb-8 px-4"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-center text-2xl md:text-[32px] font-light text-[#272727]">EXPLORE MORE</h2>
          </motion.div>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-1 mt-12 mb-20"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <motion.div variants={slideInLeft} className="grid grid-cols-2 gap-1 h-[300px] md:h-[500px]">
              <div className="relative group overflow-hidden cursor-pointer">
                <img src={c1} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="relative group overflow-hidden cursor-pointer">
                <img src={p3Hover} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </motion.div>
            <motion.div variants={slideInRight} className="relative group h-[300px] md:h-[500px] overflow-hidden cursor-pointer">
              <img src={ct3} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          </motion.div>
        </div>

        {/* About Section */}
        <motion.div
          className="container w-[90%] mx-auto flex flex-col md:flex-row justify-center items-center gap-8 bg-[#F7F4F0] p-8 mb-12"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="md:w-1/3">
            <h2 className="text-[32px] font-sans font-light text-black">Made for the Modern Saffron & Sage</h2>
          </div>
          <div className="md:w-2/3">
            <p className="text-[#333333] mb-6 text-[14px] leading-[21px]">
              Born from a background in fine arts and inspired by the beauty of the Australian coast, Saffron & Sage Traders is
              an Australian designer fashion brand that blends vibrant colours and classic silhouettes with fashion-forward details.
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-2 border border-black text-[14px] text-[#707070] cursor-pointer uppercase text-sm tracking-widest"
            >
              About Us
            </motion.button>
          </div>
        </motion.div>

        <Footer />
      </div>
    </PageTransition>
  );
}