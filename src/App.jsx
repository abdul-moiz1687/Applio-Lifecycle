import { Routes, Route } from "react-router-dom";
import "./App.css";

import Navbar from "./components/Navbar/Navbar";

import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Dashboard from "./pages/Dashboard/Dashboard";
import Appliances from "./pages/Appliances/Appliances";
import ApplianceDetails from "./pages/ApplianceDetails/ApplianceDetails";
import HowItWorks from "./pages/HowItWorks/HowItWorks";
import PublicPassport from "./pages/PublicPassport/PublicPassport";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import Footer from "./components/Footer/Footer";
import CursorFollower from "./components/CursorFollower/CursorFollower";

function App() {
  return (
    <main className="app">
      <CursorFollower />
      
      <Navbar />

     <Routes>
  <Route path="/" element={<Home />} />
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />

  <Route element={<ProtectedRoute />}>
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/appliances" element={<Appliances />} />
    <Route
      path="/appliances/:id"
      element={<ApplianceDetails />}
    />
  </Route>

  <Route
    path="/how-it-works"
    element={<HowItWorks />}
  />

  <Route
    path="/passport/:id"
    element={<PublicPassport />}
  />
</Routes>

<Footer/>

    </main>
  );
}

export default App;