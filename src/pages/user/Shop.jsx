import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "../../components/user/Navbar";
import Footer from "../../components/user/Footer";
import PageTransition from "../../components/PageTransition";
import FilterSidebar from "../../components/user/shop/FilterSidebar";
import FilterDrawer from "../../components/user/shop/FilterDrawer";
import ProductCard from "../../components/ui/ProductCard";
import EmptyState from "../../components/ui/EmptyState";
import { useProducts } from "../../context/ProductsContext";
import { useFilteredProducts } from "../../hooks/useFilteredProducts";
import { fadeUp, staggerContainer } from "../../animations";

const DEFAULT_FILTERS = { category: "All", sizes: [], colors: [], fabrics: [], sortBy: "newest" };

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, categories } = useProducts();
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  const [filters, setFilters] = useState({
    ...DEFAULT_FILTERS,
    category: searchParams.get("category") || "All",
  });

  // 1. Safely extract clean string names for components that expect primitive strings
  const cleanCategories = useMemo(() => {
    if (!categories) return [];
    return categories.map(cat => (typeof cat === "object" && cat !== null) ? cat.name : cat);
  }, [categories]);

  // Sync ?category=... parameter in the address bar
  useEffect(() => {
    const currentParam = searchParams.get("category");
    const nextParams = new URLSearchParams(searchParams);

    if (filters.category === "All") {
      if (currentParam) {
        nextParams.delete("category");
        setSearchParams(nextParams, { replace: true });
      }
    } else if (currentParam !== filters.category) {
      nextParams.set("category", filters.category);
      setSearchParams(nextParams, { replace: true });
    }
  }, [filters.category, searchParams, setSearchParams]);

  const filtered = useFilteredProducts(products, filters);

  // Calculates contextual item counts perfectly using our safe clean text keys
  const categoryCounts = useMemo(() => {
    const counts = { All: products.length };
    cleanCategories.forEach((catName) => {
      counts[catName] = products.filter((p) => {
        const prodCatName = p.category?.name ?? p.category;
        return prodCatName?.toLowerCase() === catName?.toLowerCase();
      }).length;
    });
    return counts;
  }, [products, cleanCategories]);

  return (
    <PageTransition>
      <div className="bg-white min-h-screen">
        <Navbar />

        {/* Mobile Filter Action Bar */}
        <div className="lg:hidden sticky top-[64px] z-40 bg-white border-b border-stone-100 px-4 py-3 flex justify-between items-center w-full">
          <button
            onClick={() => setIsFilterDrawerOpen(true)}
            className="flex items-center gap-2 uppercase tracking-widest text-[11px] font-semibold border border-stone-800 px-4 py-2 hover:bg-stone-50 transition-all"
          >
            <i className="ri-equalizer-line text-xs"></i> Filter & Sort
          </button>
          <div className="text-[11px] uppercase tracking-widest text-stone-400 font-medium">
            {filtered.length} Items
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-10 w-[92%] lg:w-[85%] mx-auto mt-6 lg:mt-10">
          {/* Desktop Sidebar Column */}
          <motion.aside
            className="hidden lg:block lg:col-span-1 border-r border-stone-100 pr-8"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <FilterSidebar
              categories={cleanCategories}
              filters={filters}
              onChange={setFilters}
              categoryCounts={categoryCounts}
            />
          </motion.aside>

          {/* Mobile Drawer Overlay */}
          <AnimatePresence>
            {isFilterDrawerOpen && (
              <FilterDrawer open onClose={() => setIsFilterDrawerOpen(false)}>
                <FilterSidebar
                  categories={cleanCategories}
                  filters={filters}
                  onChange={setFilters}
                  categoryCounts={categoryCounts}
                />
              </FilterDrawer>
            )}
          </AnimatePresence>

          {/* Core Grid Items */}
          <div className="col-span-1 lg:col-span-4">
            <motion.div
              className="hidden sm:flex justify-between items-center mb-6 text-[11px] font-semibold uppercase text-stone-700"
              variants={fadeUp}
              initial="hidden"
              animate="visible"
            >
              <div className="text-[11px] tracking-widest text-stone-400">
                Showing <span className="text-stone-800 font-semibold">{filtered.length}</span>{" "}
                {filters.category === "All" ? "items" : `${filters.category.toLowerCase()} items`}
              </div>
              <Link to="/" className="cursor-pointer hover:underline tracking-widest text-stone-500 hover:text-stone-900">
                ← Back to home
              </Link>
            </motion.div>

            {products.length === 0 ? (
              <EmptyState
                title="No products yet."
                message="New arrivals are added by our team through the merchant dashboard. Check back soon."
              />
            ) : filtered.length === 0 ? (
              <EmptyState
                title="No products match your filters."
                message="Try clearing the size, color or fabric filters, or pick a different category."
                actionLabel="Clear filters"
                onAction={() => setFilters(DEFAULT_FILTERS)}
              />
            ) : (
              <motion.div
                key={filters.category + filters.sortBy}
                className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-x-3 gap-y-8 lg:gap-x-4 lg:gap-y-12 mb-20"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                {filtered.map((product) => (
                  <ProductCard key={product.id ?? product._id} product={product} />
                ))}
              </motion.div>
            )}
          </div>
        </div>

        {/* Context / SEO Strip */}
        <motion.div
          className="container w-[92%] lg:w-[85%] mx-auto flex flex-col md:flex-row gap-6 md:gap-12 bg-[#F7F4F0] p-8 md:p-16 mb-16"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="md:w-1/3">
            <h2 className="text-2xl md:text-[32px] font-sans font-light tracking-wide text-black uppercase">
              {filters.category === "All" ? "Shop All" : filters.category}
            </h2>
          </div>
          <div className="md:w-2/3">
            <h2 className="text-[#333333] mb-4 font-light text-xl md:text-2xl tracking-wide">
              Curated by Saffron & Sage
            </h2>
            <p className="text-[#555555] mb-4 text-[13px] md:text-[14px] leading-relaxed font-light">
              Explore our collection of modern designer pieces for every occasion.
            </p>
            <Link to="/" className="text-[11px] font-semibold text-stone-900 tracking-widest uppercase underline underline-offset-4 hover:text-stone-600">
              Read more
            </Link>
          </div>
        </motion.div>

        <Footer />
      </div>
    </PageTransition>
  );
}