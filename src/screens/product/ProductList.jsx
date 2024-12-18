import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import "./ProductList.scss";
import AreaTableAction from "../../components/dashboard/areaTable/AreaTableAction";
import { ThemeContext } from "../../context/ThemeContext";
import { DARK_THEME, LIGHT_THEME } from "../../constants/themeConstants";
import { apiBaseUrl } from "../../constants/Constant";

// Table header definition
const TABLE_HEADS = [
    "Device Name",
    "Model",
    "Serial Number",
    "Assigned To",
    "Action",
];

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const { theme } = useContext(ThemeContext);

    // Fetch products from the server
    const fetchProducts = async ({
        page = 1,
        limit = 10,
        searchTerm = "",
    }) => {
        try {
            // Construct query parameters

            // Make the API call
            const response = await axios.get(
                `${apiBaseUrl}/product/search?searchTerm=${searchTerm}`
            );

            if (response?.status === 200) {
                setProducts(response.data?.data || []);
            }
        } catch (error) {
            console.error("Error fetching products:", error.response?.data || error.message);
        }
    };

    // Load products on initial render and when `page` or `searchQuery` changes
    useEffect(() => {
        fetchProducts({ page, searchTerm: searchQuery });
    }, [page, searchQuery]);

    return (
        <div className="flex flex-col w-full h-full">
            {/* Search Bar */}
            <div className="flex justify-start mb-6 p-2">
                <input
                    type="text"
                    className={`w-full max-w-[400px] p-3 text-base border border-gray-300 rounded-md ${theme === LIGHT_THEME
                        ? "bg-transparent text-black"
                        : "bg-[#2e2e48] text-white border-white"
                        } transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Table Section */}
            <section className="content-area-table">
                <div className="data-table-info">
                    <h4 className="data-table-title">All Products</h4>
                </div>
                <div className="data-table-diagram">
                    <table>
                        <thead>
                            <tr>
                                {TABLE_HEADS.map((th, index) => (
                                    <th key={index}>{th}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {products?.length > 0 ? (
                                products.map((dataItem) => (
                                    <tr key={dataItem._id}>
                                        <td>{dataItem.DeviceName}</td>
                                        <td>{dataItem.Model}</td>
                                        <td>{dataItem.SerialNumber}</td>
                                        <td>{dataItem.AssignedTo}</td>
                                        <td className="dt-cell-action">
                                            <AreaTableAction id={dataItem._id} />
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="text-center py-4">
                                        No products found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
};

export default ProductList;
