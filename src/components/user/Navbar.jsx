import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { auth } from "../../lib/auth";

const navItems = [
  { label: "New Arrivals", sub: ["New In"] },
  { label: "Women", sub: ["Dresses", "Denim", "Classics", "Separates", "Tops", "Co-ord Set", "Athletic", "Jewellery", "Beachwear", "Accessories", "Swimwear"] },
  { label: "Dresses", sub: ["View All", "Midi", "Maxi", "Prints"] },
  { label: "Swimwear" },
  { label: "Classics" },
  { label: "Denim" },
  { label: "Athletic" },
  { label: "Curve", sub: ["Dresses", "Denim", "Separates", "Tops", "Athletic", "Accessories", "Swimwear"] },
  { label: "Campaign", sub: ["The Golden Hour Club", "Torre Bennistra", "Liberty", "Paisley Palace", "Neptune's Kingdom"] },
  { label: "Sale", sub: ["Shop All Sale", "Dresses", "Denim", "Separates", "Tops", "Athletic", "Accessories", "Swimwear", "Active"] },
];

export default function Navbar() {
  const { cartCount } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMobileSub, setActiveMobileSub] = useState(null);
  
  const user = auth.getUser();
  const name = user?.first_name || "";

  const toggleMobileSub = (label) => {
    setActiveMobileSub(activeMobileSub === label ? null : label);
  };

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-black text-white text-[11px] sm:text-xs py-2 px-4 text-center tracking-widest uppercase font-medium">
        Free shipping on orders over $300
      </div>

      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        {/* Main Header Container */}
        <div className="container mx-auto px-4 lg:px-8 h-16 md:h-24 flex items-center justify-between relative">
          
          {/* Left: Mobile Menu Button */}
          <button
            type="button"
            className="xl:hidden text-2xl text-gray-800 p-1 -ml-1 focus:outline-none transition-colors hover:text-black"
            aria-label="Toggle navigation menu"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          >
            <i className={isMobileMenuOpen ? "ri-close-line" : "ri-menu-line"}></i>
          </button>

          {/* Center: Brand Logo */}
          <div className="flex-1 xl:flex-none text-center xl:text-left xl:absolute xl:left-8 xl:top-1/2 xl:-translate-y-1/2">
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
              <span className="logo-font text-xl sm:text-2xl font-bold tracking-widest uppercase text-stone-900 block">
                Saffron & Sage
              </span>
            </Link>
          </div>

          {/* Right: Actions / Quick Utilities */}
          <div className="flex items-center gap-1.5 sm:gap-3 xl:absolute xl:right-8 xl:top-1/2 xl:-translate-y-1/2">
            {name && (
              <span className="hidden xl:inline-block text-xs font-semibold tracking-wider text-stone-500 uppercase mr-2">
                Welcome, {name}
              </span>
            )}
            
            <a href="#" className="hidden sm:flex hover:text-black text-gray-700 w-9 h-9 items-center justify-center text-lg transition-colors">
              <i className="ri-search-line"></i>
            </a>

            <Link to="/account" className="hover:text-black text-gray-700 w-9 h-9 flex items-center justify-center text-lg transition-colors">
              <i className="ri-user-line"></i>
            </Link>

            <a href="#" className="hidden sm:flex hover:text-black text-gray-700 w-9 h-9 items-center justify-center text-lg transition-colors">
              <i className="ri-heart-3-line"></i>
            </a>

            <Link to="/cart" className="hover:text-black text-gray-700 w-9 h-9 flex items-center justify-center text-lg relative transition-colors">
              <i className="ri-shopping-bag-line"></i>
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[9px] font-bold text-white tracking-none">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Desktop Main Navigation Links */}
        <nav className="hidden xl:block w-full text-black border-t border-gray-100 bg-white">
          <ul className="flex flex-wrap justify-center items-center gap-x-8 text-[11px] font-semibold tracking-[0.2em] uppercase py-3.5">
            {navItems.map(({ label, sub }) => (
              <li key={label} className="group relative py-1">
                <Link to="/shop" className="hover:text-stone-500 transition-colors duration-200">
                  {label}
                </Link>
                {sub && (
                  <ul className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-52 bg-white border border-gray-100 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 py-3 rounded-b-md">
                    {sub.map((s) => (
                      <li key={s}>
                        <Link 
                          to="/shop" 
                          className="block px-5 py-2 hover:bg-stone-50 text-stone-600 hover:text-black text-[10px] tracking-widest normal-case transition-colors font-normal"
                        >
                          {s}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Responsive Drawer Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="xl:hidden border-t border-gray-100 bg-white max-h-[calc(100vh-110px)] overflow-y-auto smooth-scroll">
            <ul className="px-4 py-3 divide-y divide-gray-50">
              {navItems.map(({ label, sub }) => (
                <li key={label} className="py-3">
                  <div className="flex items-center justify-between">
                    <Link
                      to="/shop"
                      className="text-xs uppercase tracking-[0.2em] font-medium text-stone-900 flex-1 py-1"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {label}
                    </Link>
                    {sub && (
                      <button
                        type="button"
                        onClick={() => toggleMobileSub(label)}
                        className="text-lg text-gray-500 w-8 h-8 flex items-center justify-center rounded-full bg-stone-50"
                        aria-label="Toggle subcategories"
                      >
                        <i className={activeMobileSub === label ? "ri-subtract-line" : "ri-add-line"}></i>
                      </button>
                    )}
                  </div>
                  
                  {/* Clean Accordion Dropdown Wrap */}
                  {sub && activeMobileSub === label && (
                    <ul className="mt-2 bg-stone-50/60 rounded-lg py-1 px-3 space-y-1.5 transition-all">
                      {sub.map((s) => (
                        <li key={s}>
                          <Link 
                            to="/shop" 
                            className="block py-1.5 text-[11px] uppercase tracking-[0.15em] text-stone-500 hover:text-black transition-colors" 
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {s}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </header>
    </>
  );
}