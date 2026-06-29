// Apply category + secondary filters + sort to a product list.
// Pure hook — no DOM, no routing, just data shaping.

import { useMemo } from "react";
import { parsePrice } from "../lib/format";

const sortFns = {
  newest: (a, b) => Number(b.id ?? 0) - Number(a.id ?? 0),
  priceAsc: (a, b) => parsePrice(a.price) - parsePrice(b.price),
  priceDesc: (a, b) => parsePrice(b.price) - parsePrice(a.price),
};

export const useFilteredProducts = (
  products,
  { category = "All", sizes = [], colors = [], fabrics = [], sortBy = "newest" } = {}
) => {
  return useMemo(() => {
    let out = Array.isArray(products) ? products : [];

    if (category && category !== "All") {
      out = out.filter((p) => p.category === category);
    }
    if (sizes.length) {
      out = out.filter((p) => Array.isArray(p.sizes) && p.sizes.some((s) => sizes.includes(s)));
    }
    if (colors.length) {
      out = out.filter((p) => Array.isArray(p.colors) && p.colors.some((c) => colors.includes(c)));
    }
    if (fabrics.length) {
      out = out.filter((p) => p.fabric && fabrics.includes(p.fabric));
    }

    const sortFn = sortFns[sortBy];
    if (sortFn) out = [...out].sort(sortFn);

    return out;
  }, [products, category, sizes, colors, fabrics, sortBy]);
};