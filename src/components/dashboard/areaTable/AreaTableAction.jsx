import { useContext, useEffect, useRef, useState } from "react";
import { HiDotsHorizontal } from "react-icons/hi";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
import { ThemeContext } from "../../../context/ThemeContext";
import { LIGHT_THEME } from "../../../constants/themeConstants";
import axios from "axios";
import { apiBaseUrl } from "../../../constants/Constant";
const AreaTableAction = ({ id, reload, trash }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const handleDropdown = () => {
    setShowDropdown(!showDropdown);
  };
  const { theme } = useContext(ThemeContext);

  const dropdownRef = useRef(null);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowDropdown(false);
    }
  };

  const handleDelete = async () => {
    const confirmation = await Swal.fire({
      title: `<span style="color: ${theme === LIGHT_THEME ? "black" : "white"};">Are you sure?</span>`,
      html: `<span style="color: ${theme === LIGHT_THEME ? "black" : "white"};">Do you want to delete the selected data?</span>`,
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#475be8", // Confirm button color
      cancelButtonColor: "#d65f63", // Cancel button color
      confirmButtonText: "Yes, delete!",
      cancelButtonText: "Cancel",
      background: `${theme !== LIGHT_THEME ? "#2e2e48" : "white"}`, // Dark background color
      customClass: {
        popup: "custom-popup",
        confirmButton: "custom-confirm-button",
        cancelButton: "custom-cancel-button",
      },
    });

    if (!confirmation.isConfirmed) {
      // User canceled the delete action
      toast.info("Delete action canceled.", {
        position: "top-right",
        autoClose: 3000,
        theme: theme === LIGHT_THEME ? "light" : "dark",
      });
      return;
    }

    try {
      const response = await axios.delete(`${apiBaseUrl}/product/each${trash ? "/trash" : ""}/${id}`);

      if (response.status === 200) {
        reload(prev => prev + 1)

        toast.success("Product deleted successfully.", {
          position: "top-right",
          autoClose: 3000,
          theme: theme === LIGHT_THEME ? "light" : "dark",
        });
      }

      // Optional: Perform any additional actions like refreshing the table or redirecting
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error(
        error.message || "An error occurred while trying to delete the product.",
        {
          position: "top-right",
          autoClose: 3000,
          theme: theme === LIGHT_THEME ? "light" : "dark",
        }
      );
    }
  };
  const handleRestore = async () => {
    const confirmation = await Swal.fire({
      title: `<span style="color: ${theme === LIGHT_THEME ? "black" : "white"};">Are you sure?</span>`,
      html: `<span style="color: ${theme === LIGHT_THEME ? "black" : "white"};">Do you want to restore the data?</span>`,
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#475be8", // Confirm button color
      cancelButtonColor: "#d65f63", // Cancel button color
      confirmButtonText: "Yes, restore!",
      cancelButtonText: "Cancel",
      background: `${theme !== LIGHT_THEME ? "#2e2e48" : "white"}`, // Dark background color
      customClass: {
        popup: "custom-popup",
        confirmButton: "custom-confirm-button",
        cancelButton: "custom-cancel-button",
      },
    });

    if (!confirmation.isConfirmed) {
      // User canceled the delete action
      toast.info("Restore action canceled.", {
        position: "top-right",
        autoClose: 3000,
        theme: theme === LIGHT_THEME ? "light" : "dark",
      });
      return;
    }

    try {
      const response = await axios.patch(`${apiBaseUrl}/product/each/${id}`);

      if (response.status === 200) {
        reload(prev => prev + 1)

        toast.success("Product restored successfully.", {
          position: "top-right",
          autoClose: 3000,
          theme: theme === LIGHT_THEME ? "light" : "dark",
        });
      }

      // Optional: Perform any additional actions like refreshing the table or redirecting
    } catch (error) {
      console.error("Error restoring product:", error);
      toast.error(
        error.message || "An error occurred while trying to restore the product.",
        {
          position: "top-right",
          autoClose: 3000,
          theme: theme === LIGHT_THEME ? "light" : "dark",
        }
      );
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>

      <button
        type="button"
        className="action-dropdown-btn"
        onClick={handleDropdown}
      >
        <HiDotsHorizontal size={18} />
        {showDropdown && (
          <div className="action-dropdown-menu " ref={dropdownRef}>
            <ul className="dropdown-menu-list">
              <li className="dropdown-menu-item">
                <Link to={`/product/${id}`} className="dropdown-menu-link">
                  View
                </Link>
              </li>
              {!trash && <li className="dropdown-menu-item">
                <Link to={`/product/edit/${id}`} className="dropdown-menu-link">
                  Edit
                </Link>
              </li>}
              {trash && <li className="dropdown-menu-item">
                <button className="dropdown-menu-link" onClick={handleRestore}>
                  Restore
                </button>

              </li>}
              <li className="dropdown-menu-item">
                <button className="dropdown-menu-link" onClick={handleDelete}>
                  Delete
                </button>

              </li>
            </ul>
          </div>
        )}
      </button>
    </>
  );
};

export default AreaTableAction;
