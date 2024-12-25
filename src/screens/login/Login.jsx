import React, { useContext, useState } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { LIGHT_THEME, DARK_THEME } from "../../constants/themeConstants";
import "./LoginPage.scss";
import axios from "axios";
import { apiBaseUrl } from "../../constants/Constant";
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners"
const LoginPage = () => {
    const { theme } = useContext(ThemeContext);
    const [credentials, setCredentials] = useState({ email: "", password: "" });
    const [forgotPassword, setForgotPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState("");
    const [verified, setVerified] = useState(false);
    const [newPassword, setNewPassword] = useState(""); // For password reset
    const navigate = useNavigate();
    const [userId, setUserId] = useState("");
    const [isLoading, setIsLoading] = useState(false)

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCredentials({ ...credentials, [name]: value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${apiBaseUrl}/auth/login`, credentials);
            if (response.status === 200) {
                const { token, user } = response.data;
                localStorage.setItem("authToken", token);
                toast.success("Login successful");
                window.location.reload();
            }
        } catch (error) {
            if (error.response) {
                const { status, data } = error.response;
                switch (status) {
                    case 400:
                        toast.error(data.error || 'Invalid email or password');
                        break;
                    case 401:
                        toast.error('Unauthorized access. Please check your credentials.');
                        break;
                    case 500:
                        toast.error('Server error. Please try again later.');
                        break;
                    default:
                        toast.error(`Unexpected error: ${status}. Please try again.`);
                        break;
                }
            } else {
                console.error('Network error:', error.message);
                alert('A network error occurred. Please check your connection.');
            }
        }
    };

    const handleSendOtp = async () => {
        setIsLoading(true)
        try {
            const response = await axios.post(`${apiBaseUrl}/auth/send-otp`, { email });
            if (response.status === 200 || response.status === 201) {
                toast.success("OTP sent to your email!");
                setOtpSent(true);
                setUserId(response.data.user._id);
            }
        } catch (error) {
            toast.error("Failed to send OTP. Please try again.");
        } finally {
            setIsLoading(false)
        }
    };

    const handleVerifyOtp = async () => {
        setIsLoading(true)
        try {

            const response = await axios.post(`${apiBaseUrl}/auth/verify-otp`, { userId, otp });
            if (response.status === 200) {
                toast.success("OTP verified successfully!");
                setVerified(true);
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

    const handleResetPassword = async () => {
        setIsLoading(true)
        try {
            const response = await axios.post(`${apiBaseUrl}/auth/reset-password`, {
                userId, // Replace with dynamic userId if available
                newPassword,
            });

            if (response.status === 200) {
                toast.success(response.data.message || "Password reset successful! Redirecting to login...");
                setForgotPassword(false); // Switch back to the login form
                setOtpSent(false);
                setVerified(false);
                setEmail("");
                setOtp("");
                setNewPassword("");
                navigate("/login"); // Redirect to login page

            }
        } catch (error) {
            if (error.response && error.response.data) {
                toast.error(error.response.data.error || "Failed to reset password. Please try again.");
            } else {
                toast.error("Network error. Please check your connection.");
            }
        } finally { setIsLoading(false) }
    };


    const handleForgotPasswordSubmit = async (e) => {
        e.preventDefault();
        if (!otpSent) {
            handleSendOtp();
        } else if (!verified) {
            handleVerifyOtp();
        } else {
            handleResetPassword();
        }
    };

    return (
        <div className={`login-container ${theme === LIGHT_THEME ? "light-theme" : "dark-theme"}`}>
            <ToastContainer />
            {forgotPassword ? (
                <form className="login-form" onSubmit={handleForgotPasswordSubmit}>
                    <h1 className="login-title">Forgot Password</h1>
                    {!otpSent && (
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="text"
                                id="email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                required
                            />
                        </div>
                    )}
                    {otpSent && !verified && (
                        <div className="form-group">
                            <label htmlFor="otp">OTP</label>
                            <input
                                type="text"
                                id="otp"
                                name="otp"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                placeholder="Enter the OTP"
                                required
                                disabled={isLoading}
                            />
                        </div>
                    )}
                    {verified && (
                        <div className="form-group">
                            <label htmlFor="newPassword">New Password</label>
                            <input
                                type="password"
                                id="newPassword"
                                name="newPassword"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Enter your new password"
                                required
                                disabled={isLoading}
                            />
                        </div>
                    )}
                    <button type="submit" className="login-button">
                        {isLoading ? <ClipLoader color="white" size={20} /> : (otpSent ? (verified ? "Reset Password" : "Verify OTP") : "Send OTP")}
                    </button>
                </form>
            ) : (
                <form className="login-form" onSubmit={handleLogin}>
                    <h1 className="login-title">Login</h1>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="text"
                            id="email"
                            name="email"
                            value={credentials.email}
                            onChange={handleInputChange}
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={credentials.password}
                            onChange={handleInputChange}
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    <button type="submit" className="login-button">
                        Login
                    </button>
                    <div className="forgot-password">
                        <a href="#" onClick={() => setForgotPassword(true)}>
                            Forgot Password?
                        </a>
                    </div>
                </form>
            )}
        </div>
    );
};

export default LoginPage;
