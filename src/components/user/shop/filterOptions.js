// Static filter option lists used by the shop filter sidebar.
// These are UI options for the filter controls, not product data.
// Products and categories live in ProductsContext and only come from the admin.

export const FILTER_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

export const FILTER_COLORS = [
  { name: "Black", bg: "bg-black" },
  { name: "White", bg: "bg-white" },
  { name: "Beige", bg: "bg-stone-200" },
  { name: "Blue", bg: "bg-blue-100" },
  { name: "Olive", bg: "bg-stone-400" },
  { name: "Rose", bg: "bg-rose-200" },
];

export const FILTER_FABRICS = ["Linen", "Cotton", "Silk", "Denim", "Wool", "Polyester"];

export const FILTER_SORTS = [
  { id: "newest", label: "Newest" },
  { id: "priceAsc", label: "Price: Low to High" },
  { id: "priceDesc", label: "Price: High to Low" },
];