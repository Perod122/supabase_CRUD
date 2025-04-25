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

function App() {
  const {theme} = useThemeStore();
  return (
    <div className="min-h-screen bg-base-200 transition-colors duration-300" data-theme={theme}>
    
      <Routes>
        {/* Public pages */}
        <Route path="/" element={<AuthRedirect><LoginPage /></AuthRedirect>} />
        <Route path="/signup" element={<AuthRedirect><Register /></AuthRedirect>} />

        {/* Protected page */}
        <Route path="/home" element={<PrivateRoute><Navbar /><Dashboard /></PrivateRoute>} />
        <Route path="/settings" element={<PrivateRoute><Navbar /><Settings /></PrivateRoute>} />
        <Route path="/product/:id" element={<PrivateRoute><Navbar /><ProductPage /></PrivateRoute>} />
      </Routes>
      <Toaster />
      </div>
  );
}

export default App;
