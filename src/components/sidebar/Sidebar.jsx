import { useContext, useEffect, useRef } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { LIGHT_THEME } from "../../constants/themeConstants";
import logo from "../../assets/logo/logo.png";
import {
  MdOutlineAddBox,
  MdOutlineShoppingBag,
  MdOutlineSettings,
  MdOutlineLogout,
  MdOutlineGridView,
} from "react-icons/md";
import { TbReportAnalytics } from "react-icons/tb";
import { Link, useLocation } from "react-router-dom";
import "./Sidebar.scss";
import { SidebarContext } from "../../context/SidebarContext";

const Sidebar = () => {
  const { theme } = useContext(ThemeContext);
  const { isSidebarOpen, closeSidebar } = useContext(SidebarContext);
  const navbarRef = useRef(null);
  const location = useLocation();

  // Closing the navbar when clicked outside the sidebar area
  const handleClickOutside = (event) => {
    if (
      navbarRef.current &&
      !navbarRef.current.contains(event.target) &&
      !event.target.classList.contains("mobile-sidebar-toggle")
    ) {
      closeSidebar();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav
      className={`sidebar ${isSidebarOpen ? "sidebar-show" : ""}`}
      ref={navbarRef}
    >
      <div className="sidebar-top">
        <div className="sidebar-brand">
          <img
            src={theme === LIGHT_THEME ? logo : logo}
            alt="Logo"
            className="w-8 sm:w-12 md:w-16 lg:w-32"
          />
        </div>
      </div>
      <div className="sidebar-body">
        <div className="sidebar-menu">
          <ul className="menu-list">
            <li className="menu-item">
              <Link
                to="/"
                className={`menu-link ${location.pathname === "/" ? "active" : ""
                  }`}
              >
                <span className="menu-link-icon">
                  <MdOutlineGridView size={18} />
                </span>
                <span className="menu-link-text">Dashboard</span>
              </Link>
            </li>
            <li className="menu-item">
              <Link
                to="/products"
                className={`menu-link ${location.pathname === "/products" ? "active" : ""
                  }`}
              >
                <span className="menu-link-icon">
                  <MdOutlineShoppingBag size={20} />
                </span>
                <span className="menu-link-text">Products</span>
              </Link>
            </li>

            <li className="menu-item">
              <Link
                to="/add-product"
                className={`menu-link ${location.pathname === "/add-product" ? "active" : ""
                  }`}
              >
                <span className="menu-link-icon">
                  <MdOutlineAddBox size={18} />
                </span>
                <span className="menu-link-text">Add Product</span>
              </Link>
            </li>
            <li className="menu-item">
              <Link
                to="/reports"
                className={`menu-link ${location.pathname === "/reports" ? "active" : ""
                  }`}
              >
                <span className="menu-link-icon">
                  <TbReportAnalytics size={20} />
                </span>
                <span className="menu-link-text">Reports</span>
              </Link>
            </li>
          </ul>
        </div>

        <div className="sidebar-menu sidebar-menu2">
          <ul className="menu-list">
            <li className="menu-item">
              <Link to="/settings" className="menu-link">
                <span className="menu-link-icon">
                  <MdOutlineSettings size={20} />
                </span>
                <span className="menu-link-text">Settings</span>
              </Link>
            </li>
            <li className="menu-item">
              <div to="/" className="menu-link" onClick={() => { localStorage.clear(); window.location.reload() }}>
                <span className="menu-link-icon">
                  <MdOutlineLogout size={20} />
                </span>
                <span className="menu-link-text cursor-pointer">Logout</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
