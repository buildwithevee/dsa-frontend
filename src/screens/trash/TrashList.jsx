import { useState, useEffect, useContext } from "react";
import axios from "axios";
import "./ProductList.scss";
import AreaTableAction from "../../components/dashboard/areaTable/AreaTableAction";
import { ThemeContext } from "../../context/ThemeContext";
import { DARK_THEME, LIGHT_THEME } from "../../constants/themeConstants";
import { apiBaseUrl } from "../../constants/Constant";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { ToastContainer } from "react-toastify";
import OTPAuthorization from "./OtpSection.jsx"
// const TABLE_HEADS = 

const ProductList = () => {
    const [showTrash, setShowTrash] = useState(true)
    const [products, setProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    console.log("selectedProducts:", selectedProducts);

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const { theme } = useContext(ThemeContext);
    const [reload, setReload] = useState(0);

    const fetchProducts = async ({ page = 1, limit = 10, searchTerm = "" }) => {
        try {
            const response = await axios.get(
                `${apiBaseUrl}/product/search?searchTerm=${searchTerm}&limit=${limit}&page=${page}&isDeleted=true`
            );

            if (response?.status === 200) {
                setProducts(response.data?.data || []);
                setTotalPages(response?.data?.totalPages);
            }
        } catch (error) {
            console.error("Error fetching products:", error.response?.data || error.message);
        }
    };

    useEffect(() => {
        fetchProducts({ page, searchTerm: searchQuery });
    }, [page, searchQuery, reload]);

    return (
        <div className="flex flex-col w-full h-full">
            <ToastContainer />
            {/* Search Bar */}
            {showTrash ? <OTPAuthorization theme={theme === LIGHT_THEME} setShowTrash={setShowTrash} /> : <>
                <div className="search-bar pt-10 md:pt-0">
                    <input
                        type="text"
                        className={`search-input ${theme === LIGHT_THEME ? "light-theme" : "dark-theme"}`}
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Table Section */}
                <section className="content-area-table">
                    <div className="data-table-info flex w-full justify-between ">
                        <h4 className="data-table-title">Trash</h4>


                    </div>
                    <div className="data-table-diagram">
                        <table>
                            <thead>
                                <tr>

                                    {/* <th ><input
                                    type="checkbox"
                                    onChange={() => {
                                        setSelectedProducts(prev =>
                                            prev.length === products.length
                                                ? []
                                                : products.map(product => product._id)
                                        );
                                    }}
                                    checked={selectedProducts.length === products.length && products.length > 0}
                                /></th> */}
                                    <th  >Device Name</th>
                                    <th >Model</th>
                                    <th >Serial Number</th>
                                    <th >Assigned To</th>
                                    <th >Action</th>


                                </tr>
                            </thead>
                            <tbody>
                                {products?.length > 0 ? (
                                    products.map((dataItem) => (
                                        <tr key={dataItem._id}>
                                            {/* <td><input
                                            type="checkbox"
                                            checked={selectedProducts.includes(dataItem._id)}
                                            onChange={() => {
                                                setSelectedProducts(prev =>
                                                    prev.includes(dataItem._id)
                                                        ? prev.filter((val) => val !== dataItem._id)
                                                        : [...prev, dataItem._id]
                                                );
                                            }}
                                        /></td> */}
                                            <td>{dataItem.DeviceName}</td>
                                            <td>{dataItem.Model}</td>
                                            <td>{dataItem.SerialNumber}</td>
                                            <td>{dataItem.AssignedTo}</td>
                                            <td className="dt-cell-action">
                                                <AreaTableAction id={dataItem._id} reload={setReload} trash={true} />
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

                    {/* Pagination Section */}
                    <div className="pagination-container">
                        <button
                            className={`pagination-btn ${page === 1 ? "disabled" : ""}`}
                            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                            disabled={page === 1}
                        >
                            Previous
                        </button>
                        <span className="pagination-info">
                            Page <strong>{page}</strong> of <strong>{totalPages}</strong>
                        </span>
                        <button
                            className={`pagination-btn ${page === totalPages ? "disabled" : ""}`}
                            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={page === totalPages}
                        >
                            Next
                        </button>
                    </div>
                </section ></>}

        </div >
    );
};

export default ProductList;