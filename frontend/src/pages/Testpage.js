import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Teststate } from '../context/Testprovider';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
const TestPage = () => {
    const [test, setTest] = useState([]);

    const navigate = useNavigate();
    const { user, testId, setTestId } = Teststate();
    useEffect(()=>{
        
        if(!user){
          navigate('/');
        }
      },[navigate])
    useEffect(() => {
        if (user && user.token) {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const fetchTests = async () => {
                try {
                    const { data } = await axios.get('https://examwebsite.onrender.com/api/test', config);
                    setTest(data);
                    console.log(data);
                } catch (error) {
                    console.error('Error fetching tests:', error);
                }
            };
    
            fetchTests();
        }
    }, [user, navigate]);
    

    const handleStartTest = (testId) => {
        setTestId(testId);
        navigate(`/camera`); 
    };

    return (
        <>
        <Navbar/>
        <div className="min-h-screen bg-gray-100 p-8">
            <h1 className="text-3xl font-bold mb-6">Available Tests</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {test.map((test) => (
                    <div key={test._id} className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-xl font-semibold mb-2">{test.title}</h2>
                        <p className="text-gray-600">{test.description}</p>
                        <p className="text-gray-600 mt-1">Created At: {new Date(test.createdAt).toLocaleDateString()}</p>
                        <p className="text-gray-600 mt-1">Updated At: {new Date(test.updatedAt).toLocaleDateString()}</p>
                        <button
                            onClick={() => handleStartTest(test._id)}
                            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
                        >
                            Start Test
                        </button>
                    </div>
                ))}
            </div>
        </div>
        </>
    );
};
export default TestPage;
