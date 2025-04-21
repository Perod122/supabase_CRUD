import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Register from "./pages/Register";
import PrivateRoute from "./components/PrivateRoute";
import AuthRedirect from "./components/AuthRedirect";

function App() {
  return (
    <>
      <Routes>
        {/* Public pages */}
        <Route path="/" element={
          <AuthRedirect>
            <LoginPage />
          </AuthRedirect>
        } />
        <Route path="/signup" element={
          <AuthRedirect>
            <Register />
          </AuthRedirect>
        } />

        {/* Protected page */}
        <Route path="/home" element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
