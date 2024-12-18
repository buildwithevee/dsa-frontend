import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { ClipLoader } from "react-spinners"
const ProductDetail = () => {
    const { id } = useParams(); // Extract ID from URL
    const [product, setProduct] = useState(null); // State to store product details
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state
    const navigate = useNavigate();
    // const [qrCode, setQrCode] = useState(null);
    const [qrloading, setQrLoading] = useState(false);

    const handleGenerateAndDownloadQr = async () => {
        setLoading(true);

        try {
            const response = await axios.post("http://localhost:5000/api/product/generate", { productId: id });

            if (response.status === 200) {
                const qrCodeData = response.data.qrCodeData;

                // Create a temporary link to download the QR code
                const link = document.createElement("a");
                link.href = qrCodeData; // Data URL of the QR code
                link.download = `product_QRCode.png`; // Set the filename
                link.click(); // Programmatically click the link to trigger the download
            }
        } catch (err) {
            console.error("Failed to generate QR code:", err.message);
            setError("Failed to generate and download QR code.");
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        if (!id) {
            navigate("/products")
        }
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const response = await axios.get(
                    `http://localhost:5000/api/product/each/${id}`
                );
                if (response.status === 200) {
                    setProduct(response.data.product); // Access the 'product' key
                }
            } catch (err) {
                console.error("Error fetching product:", err);
                setError("Failed to fetch product details.");
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-gray-500">Loading product details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-gray-500">Product not found.</p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto mt-10 bg-white shadow-md rounded-lg overflow-hidden ">
            {/* Header */}
            <div className="flex flex-col sm:flex-row md:items-center justify-between px-6 py-4 border-b bg-gray-100">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-800">
                        {product.DeviceName}
                    </h1>
                    <p className="text-gray-500 text-sm">{product.SerialNumber}</p>
                </div>
                <button className="mt-4 md:mt-0 flex items-center px-4 py-2 text-white bg-purple-600 w-fit hover:bg-purple-700 rounded-lg transition duration-300">
                    ⚡<span className="ml-2 font-medium active:scale-75" onClick={handleGenerateAndDownloadQr} aria-disabled={qrloading} >{qrloading ? <ClipLoader size={20} color="white" /> : "Generate QR"}</span>
                </button>
            </div>

            {/* Product Details */}
            <div className="p-6">
                <h2 className="text-lg font-medium text-gray-700 mb-4">Basic Details</h2>
                <div className="space-y-4">
                    <DetailItem label="Device name" value={product.DeviceName} />
                    <DetailItem label="Model" value={product.Model} />
                    <DetailItem label="Serial number" value={product.SerialNumber} />
                    <DetailItem
                        label="Enrolled date"
                        value={new Date(product.EnrollDate).toLocaleDateString()}
                    />
                    <DetailItem
                        label="Compliance"
                        value={
                            product.Compilance ? (
                                <span className="text-green-600 font-medium">✅ Compliant</span>
                            ) : (
                                <span className="text-red-500 font-medium">❌ Not Compliant</span>
                            )
                        }
                    />
                    <DetailItem
                        label="Assigned to"
                        value={
                            <div className="flex items-center">
                                <div className="w-7 h-7 bg-blue-500 text-white rounded-full flex items-center justify-center mr-2">
                                    {product.AssignedTo[0]}
                                </div>
                                <span className="font-medium">{product.AssignedTo}</span>
                            </div>
                        }
                    />
                </div>
            </div>
        </div>
    );
};

// Reusable Detail Item Component
const DetailItem = ({ label, value }) => (
    <div className="flex flex-col md:flex-row md:justify-between md:items-center border-b pb-2">
        <span className="text-gray-500 font-medium text-sm md:text-base">
            {label}
        </span>
        <span className="text-gray-800 mt-1 md:mt-0 text-sm md:text-base">
            {value}
        </span>
    </div>
);

export default ProductDetail;
