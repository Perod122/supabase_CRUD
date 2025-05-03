import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Register from "./pages/Register";
import PrivateRoute from "./components/PrivateRoute";
import AuthRedirect from "./components/AuthRedirect";
import Settings from "./pages/Settings";
import Navbar from "./components/Navbar";
import { useThemeStore } from "./store/useThemeStore";
import ProductPage from "./pages/ProductPage";
import UserPage from "./pages/UserPage";
import CartPage from "./pages/CartPage";
import { useProductStore } from "./store/useProductStore";
import { useEffect } from "react";
import { fLogic } from "./store/fLogic";
import UserOrder from "./pages/UserOrder";

function App() {
  const {theme} = useThemeStore();
  const fetchUserCart = useProductStore((state) => state.fetchUserCart);
  const {fetchProducts} = useProductStore();
  useEffect(() => {
      fetchUserCart(); // fetch cart only if user is present
  }, [fetchUserCart]);

  useEffect(() => {
      fetchProducts(); // fetch products only if user is present
  }, [fetchProducts]);
  
  return (
    <div className="min-h-screen bg-base-200 transition-colors duration-300" data-theme={theme}>
    <Routes>
  {/* Public pages */}
      <Route path="/" element={<AuthRedirect><LoginPage /></AuthRedirect>} />
      <Route path="/signup" element={<AuthRedirect><Register /></AuthRedirect>} />

      {/* Admin-only pages */}
      <Route path="/home" element={
        <PrivateRoute allowedRoles={["admin"]}>
          <Navbar />
          <Dashboard />
        </PrivateRoute>
      } />
      <Route path="/settings" element={
        <PrivateRoute allowedRoles={["admin", "user"]}>
          <Navbar />
          <Settings />
        </PrivateRoute>
      } />

      {/* Pages accessible by normal users */}
      <Route path="/user" element={
        <PrivateRoute allowedRoles={["user"]}>
          <Navbar />
          <UserPage />
        </PrivateRoute>
      } />

      {/* Pages accessible by all authenticated users */}
      <Route path="/product/:id" element={
        <PrivateRoute allowedRoles={["admin"]}>
          <Navbar />
          <ProductPage />
        </PrivateRoute>
      } />

      <Route path="/mycart" element={
        <PrivateRoute allowedRoles={["user"]}>
          <Navbar />
          <CartPage />
        </PrivateRoute>
      } />

    <Route path="/myorders" element={
            <PrivateRoute allowedRoles={["user"]}>
              <Navbar />
              <UserOrder />
            </PrivateRoute>
          } />
    </Routes>

      <Toaster />
      </div>
  );
}

export default App;
