import LoginPage from "./pages/loginPage";
import Dashboard from "./pages/dashboard";
import {Routes, Route} from "react-router-dom";
import { Toaster } from "react-hot-toast";



function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<Dashboard />} />
      </Routes>
      <Toaster/>
    </div>
  )
}

export default App