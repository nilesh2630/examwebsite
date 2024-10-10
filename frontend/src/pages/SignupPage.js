import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; 
import axios from 'axios';
import { toast } from 'react-toastify'; 
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

const SignupPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(false); 
    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("userinfo"));
        if (user) navigate('/testpage');
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
       
        if (!formData.name || !formData.email || !formData.password) {
            toast.error('All fields are required!'); 
            return;
        }

        if (formData.password.length < 8) {
            toast.error('Password must be at least 8 characters long.'); 
            return;
        }

        try {
            setLoading(true); // Start loading
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                }
            };
            const { data } = await axios.post('https://examwebsite.onrender.com/api/users', formData, config);
            console.log(data);
            toast.success('User created successfully!');
            localStorage.setItem("userinfo", JSON.stringify(data));
            navigate('/testpage');
        } catch (err) {
            toast.error('An error occurred. Please try again.'); 
        } finally {
            setLoading(false); 
        }
    };

    return (
        <div className="bg-gray-100 flex items-center justify-center min-h-screen">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-semibold mb-6 text-gray-700">Create an Account</h2>
                {loading && ( 
                    <div className="mb-4 text-center">Creating your account, please wait...</div>
                )}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-gray-600 mb-2">Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name} 
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg"
                            placeholder="Name" 
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-600 mb-2">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg"
                            placeholder="Email"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-gray-600 mb-2">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg"
                            placeholder="Password"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                        Sign Up
                    </button>
                </form>
                <p className="mt-4 text-gray-600 text-center">
                    Already have an account?{' '}
                    <Link to="/login" className="text-blue-500 hover:underline">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default SignupPage;
