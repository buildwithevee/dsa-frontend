import React, { useState, useContext, useEffect } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import { LIGHT_THEME, DARK_THEME } from '../../constants/themeConstants';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios"
import { apiBaseUrl } from '../../constants/Constant';
import { apiClient } from '../../config/api';
import { ClipLoader } from 'react-spinners';
const Settings = () => {
    const { theme } = useContext(ThemeContext);

    const [settingsData, setSettingsData] = useState({
        username: '',
        email: '',
    });

    const [showPasswordFields, setShowPasswordFields] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showOTPField, setShowOTPField] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
    });
    const [otp, setOtp] = useState("")

    const handleSettingsChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSettingsData({
            ...settingsData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData({
            ...passwordData,
            [name]: value,
        });
    };

    const handleSettingsSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true)
        try {
            const response = await apiClient.post("/auth/update-user-details", settingsData); // Sends updated username and email

            if (response.status === 200) {
                // Update the state with the updated user details returned from the backend

                setShowOTPField(true)
                // Show success toast notification
                toast.success('✅ OTP sent to your current mail', {
                    position: 'top-right',
                    autoClose: 3000,
                    theme: theme === LIGHT_THEME ? 'light' : 'dark',
                });

            }
        } catch (error) {
            // Show error toast notification
            toast.error('❌ Something went wrong.', {
                position: 'top-right',
                autoClose: 3000,
                theme: theme === LIGHT_THEME ? 'light' : 'dark',
            });
            console.error('Error updating user settings:', error);
        } finally {
            setIsLoading(false)
        }
    };
    const verifyOtpFromCurrentEmail = async () => {
        setIsLoading(true)
        try {
            // Sending OTP to backend for verification
            const response = await apiClient.post('/auth/verify-otp-user-details', { otp });

            if (response.status === 200) {
                // Success toast
                toast.success('✅ OTP verified successfully. Proceed to update.', {
                    position: 'top-right',
                    autoClose: 3000,
                    theme: 'light',
                });
                setShowOTPField(false);
                loadInitalData();
            }
        } catch (error) {
            // Handle errors
            if (error.response?.status === 400) {
                toast.error('❌ Invalid or expired OTP.', {
                    position: 'top-right',
                    autoClose: 3000,
                    theme: 'light',
                });
            } else {
                toast.error('❌ Server error. Please try again later.', {
                    position: 'top-right',
                    autoClose: 3000,
                    theme: 'light',
                });
            }
            console.error('Error verifying OTP:', error);
        } finally {
            setIsLoading(false)
        }
    };


    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (!passwordData.currentPassword || !passwordData.newPassword) {
            toast.error('❌ Please fill out both password fields.', {
                position: 'top-right',
                autoClose: 3000,
                theme: theme === LIGHT_THEME ? 'light' : 'dark',
            });
        }
        try {
            const response = await apiClient.post("/auth/update-password", passwordData); // Sends updated username and email

            if (response.status === 200) {
                // Update the state with the updated user details returned from the backend
                toast.success('✅ Password changed successfully!', {
                    position: 'top-right',
                    autoClose: 3000,
                    theme: theme === LIGHT_THEME ? 'light' : 'dark',
                });
                setShowPasswordFields(false);
                setPasswordData({ currentPassword: '', newPassword: '' });
            }
        } catch (error) {
            toast.error('❌ Something went wrong.', {
                position: 'top-right',
                autoClose: 3000,
                theme: theme === LIGHT_THEME ? 'light' : 'dark',
            });
        }
    };

    const loadInitalData = async () => {
        try {
            const response = await apiClient.get(`/auth/get-user-details`);
            console.log(response.data.user);
            setSettingsData(
                {
                    email: response?.data?.user?.email,
                    username: response.data?.user?.username
                }
            )

        } catch (error) {
            toast.error("Something wen wrong")
        }
    }

    useEffect(() => {
        loadInitalData();
    }, [])

    return (
        <div className={`flex flex-col w-full h-full rounded-md p-6 ${theme === LIGHT_THEME ? 'bg-white' : 'bg-[#2e2e48]'}`}>
            <ToastContainer />
            <h1 className={`text-2xl font-semibold mb-8 text-start ${theme === LIGHT_THEME ? 'text-gray-800' : 'text-white'}`}>
                Settings
            </h1>

            {/* Settings Form */}
            <div className="space-y-8">
                {/* Account Section */}
                <div>
                    <h2 className={`text-lg font-semibold mb-4 ${theme === LIGHT_THEME ? 'text-gray-800' : 'text-white'}`}>
                        Account Details
                    </h2>
                    {!showOTPField ? (<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Username */}
                        <div>
                            <label
                                htmlFor="username"
                                className={`text-sm font-medium ${theme === LIGHT_THEME ? 'text-gray-700' : 'text-white'}`}
                            >
                                Username
                            </label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={settingsData.username}
                                onChange={handleSettingsChange}
                                className={`mt-2 w-full p-3 border ${theme === LIGHT_THEME ? 'border-gray-300' : 'border-gray-600'} rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none ${theme === DARK_THEME ? 'bg-[#383854] text-white' : 'bg-transparent'}`}
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label
                                htmlFor="email"
                                className={`text-sm font-medium ${theme === LIGHT_THEME ? 'text-gray-700' : 'text-white'}`}
                            >
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={settingsData.email}
                                onChange={handleSettingsChange}
                                className={`mt-2 w-full p-3 border ${theme === LIGHT_THEME ? 'border-gray-300' : 'border-gray-600'} rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none ${theme === DARK_THEME ? 'bg-[#383854] text-white' : 'bg-transparent'}`}
                            />
                        </div>
                    </div>) : (
                        <div className='flex flex-col'>
                            <div>
                                <label
                                    htmlFor="email"
                                    className={`text-sm font-medium ${theme === LIGHT_THEME ? 'text-gray-700' : 'text-white'}`}
                                >
                                    OTP
                                </label>
                                <input
                                    type="otp"
                                    id="otp"
                                    name="otp"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className={`mt-2 w-full p-3 border ${theme === LIGHT_THEME ? 'border-gray-300' : 'border-gray-600'} rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none ${theme === DARK_THEME ? 'bg-[#383854] text-white' : 'bg-transparent'}`}
                                />
                            </div>
                        </div>
                    )}
                </div>
                {/* Save Button */}
                <div className="flex justify-start mt-6">
                    <button
                        onClick={(e) => {
                            !showOTPField ? handleSettingsSubmit(e) : verifyOtpFromCurrentEmail(e);
                        }}
                        disabled={isLoading}
                        type="button"
                        className={`px-6 py-3 ${theme === LIGHT_THEME ? 'bg-blue-500 text-white' : 'bg-blue-600 text-white'} rounded-md hover:${theme === LIGHT_THEME ? 'bg-blue-600' : 'bg-blue-700'} focus:outline-none`}
                    >
                        {isLoading ? <ClipLoader color='white' size={20} /> : (showOTPField ? "verify" : "Update")}
                    </button>

                </div>
            </div>

            {/* Change Password Section */}
            <div className="mt-10">
                <h2 className={`text-lg font-semibold mb-4 ${theme === LIGHT_THEME ? 'text-gray-800' : 'text-white'}`}>
                    Security
                </h2>
                {!showPasswordFields ? (
                    <button
                        onClick={() => setShowPasswordFields(true)}
                        className={`px-6 py-3 ${theme === LIGHT_THEME ? 'bg-blue-500 text-white' : 'bg-blue-600 text-white'} rounded-md hover:${theme === LIGHT_THEME ? 'bg-blue-600' : 'bg-blue-700'} focus:outline-none`}
                    >
                        Change Password
                    </button>
                ) : (
                    <form onSubmit={handlePasswordSubmit} className="space-y-6 mt-4">
                        {/* Current Password */}
                        <div>
                            <label
                                htmlFor="currentPassword"
                                className={`text-sm font-medium ${theme === LIGHT_THEME ? 'text-gray-700' : 'text-white'}`}
                            >
                                Current Password
                            </label>
                            <input
                                type="password"
                                id="currentPassword"
                                name="currentPassword"
                                value={passwordData.currentPassword}
                                onChange={handlePasswordChange}
                                className={`mt-2 w-full p-3 border ${theme === LIGHT_THEME ? 'border-gray-300' : 'border-gray-600'} rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none ${theme === DARK_THEME ? 'bg-[#383854] text-white' : 'bg-transparent'}`}
                            />
                        </div>

                        {/* New Password */}
                        <div>
                            <label
                                htmlFor="newPassword"
                                className={`text-sm font-medium ${theme === LIGHT_THEME ? 'text-gray-700' : 'text-white'}`}
                            >
                                New Password
                            </label>
                            <input
                                type="password"
                                id="newPassword"
                                name="newPassword"
                                value={passwordData.newPassword}
                                onChange={handlePasswordChange}
                                className={`mt-2 w-full p-3 border ${theme === LIGHT_THEME ? 'border-gray-300' : 'border-gray-600'} rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none ${theme === DARK_THEME ? 'bg-[#383854] text-white' : 'bg-transparent'}`}
                            />
                        </div>

                        {/* Save Password Button */}
                        <div className="flex justify-between">
                            <button
                                type="button"
                                onClick={() => setShowPasswordFields(false)}
                                className={`px-6 py-3 ${theme === LIGHT_THEME ? 'bg-blue-500 text-white' : 'bg-blue-600 text-white'} rounded-md hover:${theme === LIGHT_THEME ? 'bg-blue-600' : 'bg-blue-700'} focus:outline-none`}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className={`px-6 py-3 ${theme === LIGHT_THEME ? 'bg-blue-500 text-white' : 'bg-blue-600 text-white'} rounded-md hover:${theme === LIGHT_THEME ? 'bg-blue-600' : 'bg-blue-700'} focus:outline-none`}
                            >
                                Save Password
                            </button>

                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Settings;
