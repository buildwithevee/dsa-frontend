import { useState, useContext } from 'react';
import axios from 'axios';
import { ThemeContext } from '../../context/ThemeContext';
import { LIGHT_THEME, DARK_THEME } from '../../constants/themeConstants';
import { toast, ToastContainer } from 'react-toastify'; // Import Toastify
import 'react-toastify/dist/ReactToastify.css'; // Import default styles

import { apiBaseUrl } from '../../constants/Constant';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { ClipLoader } from 'react-spinners';
const ReportPage = () => {
    const { theme } = useContext(ThemeContext);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [branch, setBranch] = useState("");
    const [loading, setLoading] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [employeeId, setEmployeeId] = useState("")
    const [employeeName, setEmployeeName] = useState("")
    const [searchTerm, setSearchTerm] = useState('');
    const handleDownload = async () => {
        if (!startDate || !endDate) {
            toast.error("Add both date")
        }
        console.log(startDate);

        // return;
        setLoading(true);
        try {
            const response = await axios.get(
                `${apiBaseUrl}/reports/get-between?startDate=${startDate}&endDate=${endDate}&branch=${branch}&assignedTo=${employeeName}`);

            if (response.status !== 200) {
                toast.error("Erro while getting data")
                throw new Error("Failed to fetch products");
            }

            const data = response.data.data
                .map(({ _id, __v, ...rest }) => rest); // Exclude _id and __v fields
            console.log(data);
            if (data.length === 0) {
                toast.success("No data found!");
                return;
            }

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
            saveAs(blob, `${startDate}to${endDate}${branch ? `of_branch_${branch}` : ""}.xlsx`);

            // Perform additional operations with the data if needed
            // For example, triggering a download or updating the UI
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
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
    const handleChange = (e) => {
        e.preventDefault();
        const { name, value } = e.target;


        // Trigger employee search on typing in AssignedTo field
        if (name === 'AssignedTo') {
            setSearchTerm(value);
            setEmployeeName(value)
            if (value) {
                searchEmployees(value);
            } else {
                setSearchResults([]);
                setShowSuggestions(false);
            }
        }
    };
    const handleSuggestionClick = (employee) => {
        console.log(employee);
        setEmployeeId(employee.Emp_ID)
        setEmployeeName(employee.Emlpoyee_Name)
        setShowSuggestions(false);
    };
    return (
        <div className='flex flex-col gap-5'>
            <ToastContainer />
            <h2 className={`text-2xl pt-10 md:pt-0 font-semibold mb-6 text-start ${theme === LIGHT_THEME ? 'text-gray-800' : 'text-white'}`}>Generate Report</h2>
            <div className="space-y-6">
                <div className="flex flex-col">
                    <label className={`text-sm font-medium ${theme === LIGHT_THEME ? 'text-gray-700' : 'text-white'}`}>
                        Branch
                    </label>
                    <div className="mt-2">
                        <select
                            value={branch}
                            required
                            onChange={(e) => setBranch(e.target.value)}
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
                <div className="flex flex-col">
                    <label htmlFor="AssignedTo" className={`text-sm font-medium ${theme === LIGHT_THEME ? 'text-gray-700' : 'text-white'}`}>
                        Assigned To <span className='text-gray-400'>(optional)</span>
                    </label>
                    <input
                        type="text"
                        id="AssignedTo"
                        name="AssignedTo"
                        value={employeeName}
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
                {/* Start Date */}
                <div className="flex flex-col">
                    <label
                        htmlFor="startDate"
                        className={`text-sm font-medium ${theme === LIGHT_THEME ? 'text-gray-700' : 'text-white'
                            }`}
                    >
                        Start Date
                    </label>
                    <input
                        type="date"
                        id="startDate"
                        name="startDate"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        required
                        className={`mt-2 p-3 border ${theme === LIGHT_THEME
                            ? 'border-gray-300'
                            : 'border-gray-600 text-white'
                            } rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none ${theme === DARK_THEME ? 'bg-[#383854] text-white' : 'bg-transparent'
                            }`}
                    />
                </div>

                {/* End Date */}
                <div className="flex flex-col">
                    <label
                        htmlFor="endDate"
                        className={`text-sm font-medium ${theme === LIGHT_THEME ? 'text-gray-700' : 'text-white'
                            }`}
                    >
                        End Date
                    </label>
                    <input
                        type="date"
                        id="endDate"
                        name="endDate"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        required
                        className={`mt-2 p-3 border ${theme === LIGHT_THEME
                            ? 'border-gray-300'
                            : 'border-gray-600 text-white'
                            } rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none ${theme === DARK_THEME ? 'bg-[#383854] text-white' : 'bg-transparent'
                            }`}
                    />
                    <style >{`
        input[type="date"]::-webkit-calendar-picker-indicator {
            filter: invert(${theme === LIGHT_THEME ? '0' : '1'}) brightness(0.5);
        }
    `}</style>
                </div>


                {/* Submit Button */}
                <div className="flex justify-end mt-6">
                    <button
                        type="button"
                        onClick={handleDownload}
                        className={`px-6 py-3 ${theme === LIGHT_THEME ? 'bg-blue-500 text-white' : 'bg-blue-600 text-white'
                            } rounded-md hover:${theme === LIGHT_THEME ? 'bg-blue-600' : 'bg-blue-700'
                            } focus:outline-none`}
                        disabled={loading}
                    >
                        {loading ? <ClipLoader color="white" /> : " Download Reports"}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ReportPage