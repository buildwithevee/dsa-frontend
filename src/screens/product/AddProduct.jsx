import { useState, useContext } from 'react';
import axios from 'axios';
import { ThemeContext } from '../../context/ThemeContext';
import { LIGHT_THEME, DARK_THEME } from '../../constants/themeConstants';
import { toast, ToastContainer } from 'react-toastify'; // Import Toastify
import 'react-toastify/dist/ReactToastify.css'; // Import default styles
import { useNavigate } from 'react-router-dom';
import { apiBaseUrl } from '../../constants/Constant';
const ProductAddPage = () => {
    const [productData, setProductData] = useState({
        DeviceName: '',
        Model: '',
        SerialNumber: '',
        EnrollDate: '',
        Compilance: false,
        AssignedTo: '',
        warranty: "",
        note: "",
        branch: "",
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const { theme } = useContext(ThemeContext);
    const navigate = useNavigate();
    const handleChange = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        setProductData({
            ...productData,
            [name]: value
        });

        // Trigger employee search on typing in AssignedTo field
        if (name === 'AssignedTo') {
            setSearchTerm(value);
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
        setProductData({ ...productData, AssignedTo: employee.Emlpoyee_Name });
        setShowSuggestions(false);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${apiBaseUrl}/product/create`, productData);
            if (response.status === 201) {
                toast.success('🎉 Product added successfully!', {
                    position: "top-right",
                    autoClose: 3000, // Closes in 3 seconds
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: theme === LIGHT_THEME ? "light" : "dark", // Adjust theme dynamically
                });

                setProductData({
                    DeviceName: '',
                    Model: '',
                    SerialNumber: '',
                    EnrollDate: '',
                    Compilance: false,
                    AssignedTo: '',
                    branch: "",
                    note: "", warranty: ""
                });
                navigate(`/product/${response.data?.product?._id}`);
            }
        } catch (error) {
            console.error('Error adding product', error);
            toast.error('❌ Failed to add product. Please try again.', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: theme === LIGHT_THEME ? "light" : "dark",
            });
        }
    };


    return (
        <div className={`flex flex-col w-full h-full rounded-md p-6 ${theme === LIGHT_THEME ? 'bg-white' : 'bg-[#2e2e48]'}`}>
            <ToastContainer /> {/* Place this once in y our component */}
            <h1 className={`text-2xl font-semibold mb-6 text-start ${theme === LIGHT_THEME ? 'text-gray-800' : 'text-white'}`}>
                Add New Product
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Device Name */}
                <div className="flex flex-col">
                    <label htmlFor="DeviceName" className={`text-sm font-medium ${theme === LIGHT_THEME ? 'text-gray-700' : 'text-white'}`}>
                        Device Name
                    </label>
                    <input
                        type="text"
                        id="DeviceName"
                        name="DeviceName"
                        value={productData.DeviceName}
                        onChange={handleChange}
                        required
                        className={`mt-2 p-3 border ${theme === LIGHT_THEME ? 'border-gray-300' : 'border-gray-600 text-white '} rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none ${theme === DARK_THEME ? 'bg-[#383854] text-white' : 'bg-transparent'}`}
                    />
                </div>

                {/* Model */}
                <div className="flex flex-col">
                    <label htmlFor="Model" className={`text-sm font-medium ${theme === LIGHT_THEME ? 'text-gray-700' : 'text-white'}`}>
                        Model
                    </label>
                    <input
                        type="text"
                        id="Model"
                        name="Model"
                        value={productData.Model}
                        onChange={handleChange}
                        required
                        className={`mt-2 p-3 border ${theme === LIGHT_THEME ? 'border-gray-300' : 'border-gray-600 text-white'} rounded-md  focus:ring-2 focus:ring-blue-500 focus:outline-none ${theme === DARK_THEME ? 'bg-[#383854] text-white' : 'bg-transparent'}`}
                    />
                </div>

                {/* Serial Number */}
                <div className="flex flex-col">
                    <label htmlFor="SerialNumber" className={`text-sm font-medium ${theme === LIGHT_THEME ? 'text-gray-700' : 'text-white'}`}>
                        Serial Number
                    </label>
                    <input
                        type="text"
                        id="SerialNumber"
                        name="SerialNumber"
                        value={productData.SerialNumber}
                        onChange={handleChange}
                        required
                        className={`mt-2 p-3 border ${theme === LIGHT_THEME ? 'border-gray-300' : 'border-gray-600 text-white'} rounded-md  focus:ring-2 focus:ring-blue-500 focus:outline-none ${theme === DARK_THEME ? 'bg-[#383854] text-white' : 'bg-transparent'}`}
                    />
                </div>

                {/* Enroll Date */}
                <div className="flex flex-col">
                    <label htmlFor="EnrollDate" className={`text-sm font-medium ${theme === LIGHT_THEME ? 'text-gray-700' : 'text-white'}`}>
                        Enroll Date
                    </label>
                    <input
                        type="date"
                        id="EnrollDate"
                        name="EnrollDate"
                        value={productData.EnrollDate}
                        onChange={handleChange}
                        required
                        className={`mt-2 p-3 border ${theme === LIGHT_THEME ? 'border-gray-300' : 'border-gray-600 text-white'} rounded-md  focus:ring-2 focus:ring-blue-500 focus:outline-none ${theme === DARK_THEME ? 'bg-[#383854] text-white' : 'bg-transparent'}`}
                    />
                </div>

                {/* Compliance */}
                <div className="flex flex-col">
                    <label className={`text-sm font-medium ${theme === LIGHT_THEME ? 'text-gray-700' : 'text-white'}`}>
                        Compliance
                    </label>
                    <div className="flex items-center mt-2">
                        <input
                            type="checkbox"
                            id="Compilance"
                            name="Compilance"
                            checked={productData.Compilance}
                            onChange={(e) => setProductData({ ...productData, Compilance: e.target.checked })}
                            className="form-checkbox h-5 w-5 text-blue-500"
                        />
                        <span className={`ml-2 ${theme === LIGHT_THEME ? 'text-gray-700' : 'text-white'}`}>
                            Mark as Compliant
                        </span>
                    </div>
                </div>

                {/* Warranty */}
                <div className="flex flex-col">
                    <label className={`text-sm font-medium ${theme === LIGHT_THEME ? 'text-gray-700' : 'text-white'}`}>
                        Warranty
                    </label>
                    <input
                        type="date"
                        id="warranty"
                        name="warranty"
                        value={productData.warranty}
                        onChange={handleChange}
                        className={`mt-2 p-3 border ${theme === LIGHT_THEME ? 'border-gray-300' : 'border-gray-600 text-white'} rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none ${theme === DARK_THEME ? 'bg-[#383854] text-white' : 'bg-transparent'}`}
                    />
                    <style >{`
        input[type="date"]::-webkit-calendar-picker-indicator {
            filter: invert(${theme === LIGHT_THEME ? '0' : '1'}) brightness(0.5);
        }
    `}</style>
                </div>

                {/* Branch */}
                <div className="flex flex-col">
                    <label className={`text-sm font-medium ${theme === LIGHT_THEME ? 'text-gray-700' : 'text-white'}`}>
                        Branch
                    </label>
                    <div className="mt-2">
                        <select
                            value={productData.branch || ""}
                            required
                            onChange={(e) => setProductData({ ...productData, branch: e.target.value })}
                            className={`p-2 w-full rounded-md border ${theme === LIGHT_THEME ? 'bg-white text-gray-700' : 'bg-gray-700 text-white'} focus:outline-none`}
                        >
                            <option value="">Select a branch</option>
                            <option value="JEDDAH">JEDDAH</option>
                            <option value="RIYADH">RIYADH</option>
                            <option value="MAKKAH">MAKKAH</option>
                            <option value="JEZAN">JEZAN</option>
                            <option value="RAAS">RAAS</option>
                            <option value="ALBAHA">ALBAHA</option>
                            <option value="ABHA">ABHA</option>
                            <option value="ALJOUF">ALJOUF</option>
                            <option value="HAIL">HAIL</option>
                            <option value="MADINAH">MADINAH</option>
                            <option value="SHIFA">SHIFA</option>
                            {/* Add more branches as needed */}
                        </select>
                    </div>
                </div>


                {/* Assigned To */}
                <div className="flex flex-col">
                    <label htmlFor="AssignedTo" className={`text-sm font-medium ${theme === LIGHT_THEME ? 'text-gray-700' : 'text-white'}`}>
                        Assigned To
                    </label>
                    <input
                        type="text"
                        id="AssignedTo"
                        name="AssignedTo"
                        value={productData.AssignedTo}
                        onChange={handleChange}
                        required
                        className={`mt-2 p-3 border ${theme === LIGHT_THEME ? 'border-gray-300' : 'border-gray-600 text-white'} rounded-md  focus:ring-2 focus:ring-blue-500 focus:outline-none ${theme === DARK_THEME ? 'bg-[#383854] text-white' : 'bg-transparent'}`}
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
                </div>
                {/* Note */}
                <div className="flex flex-col">
                    <label htmlFor="note" className={`text-sm font-medium ${theme === LIGHT_THEME ? 'text-gray-700' : 'text-white'}`}>
                        Note
                    </label>
                    <textarea
                        type="text"
                        id="note"
                        name="note"
                        rows="4" // Adjust rows to control height

                        value={productData.note}
                        onChange={handleChange}
                        required
                        className={`mt-2 p-3 border ${theme === LIGHT_THEME ? 'border-gray-300' : 'border-gray-600 text-white'} rounded-md  focus:ring-2 focus:ring-blue-500 focus:outline-none ${theme === DARK_THEME ? 'bg-[#383854] text-white' : 'bg-transparent'}`}
                    />
                </div>

                {/* Submit Button */}
                <div className="flex justify-end mt-6">
                    <button
                        type="submit"
                        className={`px-6 py-3 ${theme === LIGHT_THEME ? 'bg-blue-500 text-white' : 'bg-blue-600 text-white'} rounded-md hover:${theme === LIGHT_THEME ? 'bg-blue-600' : 'bg-blue-700'} focus:outline-none`}
                    >
                        Add Product
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProductAddPage;
