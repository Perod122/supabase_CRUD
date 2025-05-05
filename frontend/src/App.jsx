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
import UserOrder from "./pages/UserOrder";
import OrderPageAdmin from "./pages/OrderPageAdmin";
import { useOrderStore } from "./store/useOrder";
import useAuth from "./hooks/useAuth";
import LoadingScreen from "./components/LoadingScreen";

function App() {
  const {theme} = useThemeStore();
  const fetchUserCart = useProductStore((state) => state.fetchUserCart);
  const {fetchProducts} = useProductStore();
  const {getAllOrders} = useOrderStore();
  const authenticated = useAuth();

  useEffect(() => {
    if (authenticated) {
      fetchUserCart();
      fetchProducts();
      getAllOrders();
    }
  }, [authenticated, fetchUserCart, fetchProducts, getAllOrders]);
  
  if (authenticated === null) {
    return <LoadingScreen message="Loading Initialized...." />;
  }

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

    <Route path="/orders" element={
            <PrivateRoute allowedRoles={["admin"]}>
              <Navbar />
              <OrderPageAdmin />
            </PrivateRoute>
      } />
    </Routes>

      <Toaster />
      </div>
  );
}

export default App;
