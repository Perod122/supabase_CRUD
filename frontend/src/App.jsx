import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Custom hooks
import useAuth from "./hooks/useAuth";
import { useThemeStore } from "./store/useThemeStore";
import { useProductStore } from "./store/useProductStore";
import { useOrderStore } from "./store/useOrder";

// Components
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import AuthRedirect from "./components/AuthRedirect";
import LoadingScreen from "./components/LoadingScreen";

// Pages
import LoginPage from "./pages/loginPage";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import ProductPage from "./pages/ProductPage";
import UserPage from "./pages/UserPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import UserOrder from "./pages/UserOrder";
import OrderPageAdmin from "./pages/OrderPageAdmin";
import PageNotFound from "./pages/404Page";

// Route configurations
const ROUTES = {
  public: [
    { path: "/", element: LoginPage },
    { path: "/signup", element: Register }
  ],
  admin: [
    { path: "/home", element: Dashboard },
    { path: "/product/:id", element: ProductPage },
    { path: "/orders", element: OrderPageAdmin }
  ],
  user: [
    { path: "/user", element: UserPage },
    { path: "/mycart", element: CartPage },
    { path: "/checkout", element: CheckoutPage },
    { path: "/myorders", element: UserOrder }
  ],
  shared: [
    { path: "/settings", element: Settings, roles: ["admin", "user"] }
  ]
};

function App() {
  const { theme } = useThemeStore();
  const { fetchUserCart, fetchProducts} = useProductStore();
  const { getAllOrders, getUserOrders } = useOrderStore();
  

  useEffect(() => {
      getUserOrders();
      fetchUserCart();
      fetchProducts();
      getAllOrders();
  }, [ getUserOrders, fetchUserCart, fetchProducts, getAllOrders]);
  

  return (
    <div className="min-h-screen bg-base-200 transition-colors duration-300" data-theme={theme}>
      <Routes>
      <Route path="*" element={<PageNotFound />} />
        {/* Public Routes */}
        {ROUTES.public.map(({ path, element: Element }) => (
          <Route
            key={path} 
            path={path} 
            element={
              <AuthRedirect>
                <Element />
              </AuthRedirect>
            }
          />
        ))}

        {/* Admin Routes */}
        {ROUTES.admin.map(({ path, element: Element }) => (
          <Route
            key={path} 
            path={path} 
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <Navbar />
                <Element />
              </PrivateRoute>
            }
          />
        ))}

        {/* User Routes */}
        {ROUTES.user.map(({ path, element: Element }) => (
          <Route
            key={path} 
            path={path} 
            element={
              <PrivateRoute allowedRoles={["user"]}>
                <Navbar />
                <Element />
              </PrivateRoute>
            }
          />
        ))}

        {/* Shared Routes */}
        {ROUTES.shared.map(({ path, element: Element, roles }) => (
          <Route
            key={path} 
            path={path} 
            element={
              <PrivateRoute allowedRoles={roles}>
                <Navbar />
                <Element />
              </PrivateRoute>
            }
          />
        ))}
      </Routes>

      <Toaster />
    </div>
  );
}

export default App;