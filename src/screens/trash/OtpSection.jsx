import { useState } from "react";
import { toast } from "react-toastify";
import { apiBaseUrl } from "../../constants/Constant";
import axios from "axios";
import { ClipLoader } from "react-spinners";

function OTPAuthorization({ theme, setShowTrash }) {
    const [otpSent, setOtpSent] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [otp, setOtp] = useState("");

    const handleSendOtp = async () => {
        setIsLoading(true);
        try {
            const response = await axios.post(`${apiBaseUrl}/auth/trash-access-otp`);
            if (response.status === 200 || response.status === 201) {
                toast.success("OTP sent to your email!");
                setOtpSent(true);
            }
        } catch (error) {
            toast.error("Failed to send OTP. Please try again.");
        } finally {
            setIsLoading(false)
        }
    };

    const handleOtpChange = (e) => {
        setOtp(e.target.value);
    };

    const handleVerifyOtp = async () => {
        setIsLoading(true)
        try {

            const response = await axios.post(`${apiBaseUrl}/auth/trash-access-verification`, { otp });
            if (response.status === 200) {
                toast.success("OTP verified successfully!");
                setShowTrash(false)
            } else {
                toast.error(response.data.message || "Invalid OTP. Please try again.");
            }
        } catch (error) {
            if (error.response) {
                toast.error(error.response.data.message || "OTP verification failed. Please try again.");
            } else {
                toast.error("Network error. Please check your connection.");
            }
        } finally {
            setIsLoading(false)
        }
    };

    return (
        <div className="w-full h-[80vh] flex flex-col items-center justify-center  ">
            <div className={`${theme ? "bg-[#fafafa]" : "bg-[#2e2e48]"} p-6 rounded-lg shadow-md w-80`}>
                <h1 className={`text-xl font-semibold text-center mb-4  ${theme ? "text-black" : "text-white"}`}>
                    To enter trash, please provide OTP for authorization
                </h1>
                {!otpSent ? (
                    <button
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                        onClick={handleSendOtp}
                    >
                        {isLoading ? <ClipLoader color={`${theme ? "black" : "white"}`} /> : "Send OTP to Email"}
                    </button>
                ) : (
                    <div className="mt-4">
                        <label htmlFor="otp" className="block text-sm font-medium text-white">
                            Enter OTP
                        </label>
                        <input
                            type="text"
                            id="otp"
                            value={otp}
                            onChange={handleOtpChange}
                            className={`mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${!theme && "bg-transparent text-white"}`}
                            placeholder="Enter your OTP"
                        />
                        <button
                            className="w-full bg-blue-500 text-white py-2 px-4 rounded mt-4 hover:bg-blue-600"
                            onClick={handleVerifyOtp}
                        >
                            Submit OTP
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default OTPAuthorization;