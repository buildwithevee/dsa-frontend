import { useState, useEffect, useContext } from "react";
import axios from "axios";
import "./EmpData.scss";
import AreaTableAction from "../../components/dashboard/areaTable/AreaTableAction";
import { ThemeContext } from "../../context/ThemeContext";
import { DARK_THEME, LIGHT_THEME } from "../../constants/themeConstants";
import { apiBaseUrl } from "../../constants/Constant";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { ToastContainer } from "react-toastify";
// const TABLE_HEADS = 

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    console.log("selectedProducts:", selectedProducts);

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const { theme } = useContext(ThemeContext);
    const [reload, setReload] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [empId, setEmpId] = useState("");
    const fetchProducts = async ({ page = 1, limit = 10, searchTerm = "" }) => {
        try {
            const response = await axios.get(
                `${apiBaseUrl}/product/search?searchTerm=${empId}&limit=${limit}&page=${page}&isDeleted=false`
            );

            if (response?.status === 200) {
                setProducts(response.data?.data || []);
                setTotalPages(response?.data?.totalPages);
            }
        } catch (error) {
            console.error("Error fetching products:", error.response?.data || error.message);
        }
    };
    const exportToExcel = () => {
        // Create a worksheet from JSON data
        const data = products
            .filter((val) => selectedProducts.includes(val._id))
            .map(({ _id, __v, ...rest }) => rest); // Exclude _id and __v fields

        const worksheet = XLSX.utils.json_to_sheet(data);

        // Create a workbook and append the worksheet
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

        // Generate Excel file and trigger download
        const excelBuffer = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "array",
        });

        // Save the file
        const blob = new Blob([excelBuffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
        });
        saveAs(blob, "output.xlsx");
    };
    const handleChange = (e) => {
        e.preventDefault();
        const { name, value } = e.target;

        // Trigger employee search on typing in AssignedTo field
        if (name === 'AssignedTo') {
            setSearchTerm(value);
            setSearchQuery(value)
            if (value) {
                searchEmployees(value);
            } else {
                setSearchResults([]);
                setShowSuggestions(false);
            }
        }
    };
    const searchEmployees = async (term) => {
        try {
            const response = await axios.get(`${apiBaseUrl}/product/search-employee?searchTerm=${term}`);
            if (response.status === 200 && response.data.success) {
                setSearchResults(response.data.employees || []);
                setShowSuggestions(true);
            }
        } catch (error) {
            console.error('Error fetching employees:', error);
            setSearchResults([]);
        }
    };
    const handleSuggestionClick = (employee) => {
        console.log(employee);
        setEmpId(employee.Emp_ID);
        setSearchQuery(employee.Emlpoyee_Name)

        setShowSuggestions(false);

    };
    useEffect(() => {
        if (empId) {
            fetchProducts({ page, searchTerm: empId });
        }
    }, [page, reload]);

    return (
        <div className="flex flex-col w-full h-full">
            <ToastContainer />
            {/* Search Bar */}
            <div className="search-bar pt-10 md:pt-0">
                <div className="flex flex-row w-full md:w-96 gap-3">

                    <input
                        type="text"
                        id="AssignedTo"
                        name="AssignedTo"
                        value={searchQuery}
                        onChange={handleChange}
                        required
                        placeholder="Search by employee name or emplyee id"
                        className={`mt-2 w-full p-3 border ${theme === LIGHT_THEME ? 'border-gray-300' : 'border-gray-600 text-white'} rounded-md  focus:ring-2 focus:ring-blue-500 focus:outline-none ${theme === DARK_THEME ? 'bg-[#383854] text-white' : 'bg-transparent'}`}
                    />
                    {showSuggestions && searchResults.length > 0 && (
                        <ul className={`absolute z-10 mt-20 w-fit  border border-gray-300 rounded-md shadow-lg overflow-hidden ${theme === DARK_THEME ? 'bg-[#373753] text-white border-gray-600 ' : 'bg-white'}`}>
                            {searchResults.map((employee) => (
                                <li
                                    key={employee._id}
                                    className={`px-4 py-2 hover:bg-blue-600 cursor-pointer ${theme === LIGHT_THEME ? "hover:text-white" : ""} `}
                                    onClick={() => handleSuggestionClick(employee)}
                                >
                                    {employee.Emlpoyee_Name} (ID: {employee.Emp_ID})
                                </li>
                            ))}
                        </ul>
                    )}
                    <button onClick={() => fetchProducts({ page, searchTerm: empId })} className={`px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer active:scale-95 ${theme === LIGHT_THEME ? "" : ""} `}>Search</button>
                </div>
            </div>

            {/* Table Section */}
            <section className="content-area-table">
                <div className="data-table-info flex w-full justify-between ">
                    <h4 className="data-table-title">All Products</h4>
                    <div className="pb-2">
                        {selectedProducts.length !== 0 && <button className={`pagination-btn ${selectedProducts.length === 0 ? "disabled" : ""}`} onClick={exportToExcel}>Download</button>}
                    </div>

                </div>
                <div className="data-table-diagram">
                    <table>
                        <thead>
                            <tr>

                                <th ><input
                                    type="checkbox"
                                    onChange={() => {
                                        setSelectedProducts(prev =>
                                            prev.length === products.length
                                                ? []
                                                : products.map(product => product._id)
                                        );
                                    }}
                                    checked={selectedProducts.length === products.length && products.length > 0}
                                /></th>
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
                                        <td><input
                                            type="checkbox"
                                            checked={selectedProducts.includes(dataItem._id)}
                                            onChange={() => {
                                                setSelectedProducts(prev =>
                                                    prev.includes(dataItem._id)
                                                        ? prev.filter((val) => val !== dataItem._id)
                                                        : [...prev, dataItem._id]
                                                );
                                            }}
                                        /></td>
                                        <td>{dataItem.DeviceName}</td>
                                        <td>{dataItem.Model}</td>
                                        <td>{dataItem.SerialNumber}</td>
                                        <td>{dataItem.AssignedTo}</td>
                                        <td className="dt-cell-action">
                                            <AreaTableAction id={dataItem._id} reload={setReload} trash={false} />
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
            </section >
        </div >
    );
};

export default ProductList;