import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { CartProvider } from "./context/CartContext";
import { ProductsProvider } from "./context/ProductsContext";

// Admin pages
import AdminLogin from "./pages/admin/Login";
import Merchant from "./pages/admin/Merchant";
import Dashboard from "./pages/admin/Dashboard";
import ViewProducts from "./pages/admin/ViewProducts";
import ViewCategories from "./pages/admin/ViewCategories";
import AdminUsers from "./pages/admin/Users";
import CreateProduct from "./pages/admin/CreateProduct";
import CreateCategory from "./pages/admin/CreateCategory";
import CreateUser from "./pages/admin/CreateUser";
import ProtectedRoute from "./components/admin/ProtectedRoute";

// User pages
import Home from "./pages/user/Home";
import Shop from "./pages/user/Shop";
import ProductPage from "./pages/user/ProductPage";
import Cart from "./pages/user/Cart";
import Checkout from "./pages/user/Checkout";
import Account from "./pages/user/Account";

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* User routes */}
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/account" element={<Account />} />

        {/* Admin public routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/register" element={<Merchant />} />

        {/* Admin protected routes */}
        <Route path="/admin/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/admin/products" element={<ProtectedRoute><ViewProducts /></ProtectedRoute>} />
        <Route path="/admin/categories" element={<ProtectedRoute><ViewCategories /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute><AdminUsers /></ProtectedRoute>} />
        <Route path="/admin/create-product" element={<ProtectedRoute><CreateProduct /></ProtectedRoute>} />
        <Route path="/admin/create-category" element={<ProtectedRoute><CreateCategory /></ProtectedRoute>} />
        <Route path="/admin/create-user" element={<ProtectedRoute><CreateUser /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <ProductsProvider>
      <CartProvider>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <AnimatedRoutes />
        </BrowserRouter>
      </CartProvider>
    </ProductsProvider>
  );
}