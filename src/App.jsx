import { useContext, useEffect } from "react";
import "./App.scss";
import { ThemeContext } from "./context/ThemeContext";
import { DARK_THEME, LIGHT_THEME } from "./constants/themeConstants";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MoonIcon from "./assets/icons/moon.svg";
import SunIcon from "./assets/icons/sun.svg";
import BaseLayout from "./layout/BaseLayout";
import { Dashboard, PageNotFound } from "./screens";
import ProductList from "./screens/product/ProductList.jsx";
import ProductAddPage from "./screens/product/AddProduct.jsx";
import SingleProduct from "./screens/singleProduct/SingleProduct.jsx";
import EditProduct from "./screens/edit/EditProduct.jsx";
import LoginPage from "./screens/login/Login.jsx";
import SettingsPage from "./screens/settings/SettingsPage.jsx";
import ReportPage from "./screens/reports/ReportPage.jsx";
import { useDispatch } from "react-redux";
import { setLogin } from "./config/authSlice.js";
import PrivateRoute from "./routes/PrivateRouter.jsx";
import PublicRoute from "./routes/PublicRouter.jsx";

function App() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const dispatch = useDispatch();


  useEffect(() => {
    // Apply the correct theme class to the body tag
    if (theme === DARK_THEME) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
    // Check if the user is already logged in
    if (localStorage.getItem("authToken")) {
      dispatch(setLogin());
    }
  }, [theme]);

  return (
    <>
      <Router>
        <Routes>
          {/* Private Routes */}
          <Route element={<BaseLayout />}>
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <PrivateRoute>
                  <SettingsPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/products"
              element={
                <PrivateRoute>
                  <ProductList />
                </PrivateRoute>
              }
            />
            <Route
              path="/add-product"
              element={
                <PrivateRoute>
                  <ProductAddPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <PrivateRoute>
                  <ReportPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/product/:id"
              element={
                <PrivateRoute>
                  <SingleProduct />
                </PrivateRoute>
              }
            />
            <Route
              path="/product/edit/:id"
              element={
                <PrivateRoute>
                  <EditProduct />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<PageNotFound />} />
          </Route>

          {/* Public Routes */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
        </Routes>

        <button
          type="button"
          className="theme-toggle-btn"
          onClick={toggleTheme}
        >
          <img
            className="theme-icon"
            src={theme === LIGHT_THEME ? SunIcon : MoonIcon}
            alt={theme === LIGHT_THEME ? "Light Mode" : "Dark Mode"}
          />
        </button>
      </Router>
    </>
  );
}

export default App;
