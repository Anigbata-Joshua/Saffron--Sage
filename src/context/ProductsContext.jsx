// Single source of truth for products across the app.
//
// Why this exists:
// - Admin-created products never made it onto the Shop because there was no
//   shared store. Each page fetched independently from an API that may be
//   unreachable, then the Shop filtered by `category` (a name) but the API
//   returns `category_id` (a number).
// - This context stores ONLY products/categories created through the admin
//   panel. Nothing is seeded — the shop starts empty until the admin adds
//   something.
// - Persists to localStorage so a freshly created product survives a refresh.

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "saffron_products_v1";
const CATEGORIES_KEY = "saffron_categories_v1";

const safeParse = (raw, fallback) => {
  try {
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const ProductsContext = createContext(null);

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState(() => {
    const stored = safeParse(localStorage.getItem(STORAGE_KEY), null);
    return Array.isArray(stored) ? stored : [];
  });

  const [categories, setCategories] = useState(() => {
    const stored = safeParse(localStorage.getItem(CATEGORIES_KEY), null);
    return Array.isArray(stored) ? stored : [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    } catch {
      // localStorage unavailable — non-fatal.
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
    } catch {
      // localStorage unavailable — non-fatal.
    }
  }, [categories]);

  const addProduct = useCallback((product) => {
    setProducts((prev) => {
      const id = product.id ?? `local-${Date.now()}`;
      const filtered = prev.filter((p) => p.id !== id);
      return [{ ...product, id }, ...filtered];
    });
  }, []);

  const removeProduct = useCallback((id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const addCategory = useCallback((category) => {
    setCategories((prev) => {
      const id = category.id ?? `cat-local-${Date.now()}`;
      const filtered = prev.filter((c) => c.id !== id && c.name?.toLowerCase() !== category.name?.toLowerCase());
      return [{ ...category, id }, ...filtered];
    });
  }, []);

  const removeCategory = useCallback((id) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  }, []);

  // Wipe any stale data — useful if a previous version of the app left
  // mock products in localStorage. Admin can call this to start clean.
  const clearAll = useCallback(() => {
    setProducts([]);
    setCategories([]);
  }, []);

  const value = useMemo(
    () => ({ products, categories, addProduct, removeProduct, addCategory, removeCategory, clearAll }),
    [products, categories, addProduct, removeProduct, addCategory, removeCategory, clearAll]
  );

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
}

export const useProducts = () => {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error("useProducts must be used inside <ProductsProvider>");
  return ctx;
};