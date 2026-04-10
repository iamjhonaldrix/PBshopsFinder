import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navigator from "./Nav.jsx";
import Body from "./Body.jsx";
import Signup from "./Signup.jsx";
import Login from "./Login.jsx";
import Dashboard from "./Dashboard.jsx";
import Footer from "./Footer.jsx";
import ShopProfile from "./ShopProfile";
import Categories from "./Categories";

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

function App() {
  const location = useLocation();
  const hideFooterRoutes = ["/", "/signup", "/login", "/dashboard"];
  const showFooter = !hideFooterRoutes.includes(location.pathname);

  return (
    <>
      <Navigator />
      <Routes>
        <Route path="/" element={<Body />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/shops/:id" element={<ShopProfile />} />
        <Route path="/categories" element={<Categories />} />
      </Routes>
      {showFooter && <Footer />}
    </>
  );
}

export default AppWrapper;