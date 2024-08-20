import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useNavigate } from 'react-router-dom';
import { Teststate } from '../context/Testprovider';
const Cameracontroller = () => {
    const [hasCameraPermission, setHasCameraPermission] = useState(false);
    const [hasMicrophonePermission, setHasMicrophonePermission] = useState(false);
    const [isPermissionChecked, setIsPermissionChecked] = useState(false);
    const videoRef = useRef(null);
    const navigate = useNavigate();
    const { user, testId, setTestId } = Teststate();
    useEffect(()=>{
        
        if(!user){
          navigate('/');
        }
      },[navigate])
    useEffect(() => {
        const getPermissions = async () => {
            try {
                // Check camera and microphone permissions
                const cameraStream = await navigator.mediaDevices.getUserMedia({ video: true });
                const microphoneStream = await navigator.mediaDevices.getUserMedia({ audio: true });

                if (cameraStream) {
                    setHasCameraPermission(true);
                    cameraStream.getTracks().forEach(track => track.stop()); // Stop the stream
                }

                if (microphoneStream) {
                    setHasMicrophonePermission(true);
                    microphoneStream.getTracks().forEach(track => track.stop()); // Stop the stream
                }
            } catch (error) {
                if (error.name === 'NotAllowedError') {
                    toast.error('Permissions not granted.');
                } else {
                    toast.error('An error occurred while requesting permissions.');
                }
            } finally {
                setIsPermissionChecked(true);
            }
        };

        getPermissions();
    }, []);

    useEffect(() => {
        if (hasCameraPermission) {
            const startCamera = async () => {
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                        videoRef.current.play();
                    }
                } catch (error) {
                    toast.error('An error occurred while accessing the camera.');
                }
            };

            startCamera();
        }
    }, [hasCameraPermission]);

    const handleProceed = () => {
        if (hasCameraPermission && hasMicrophonePermission) {
            // Redirect to the next page or handle proceeding logic here
            toast.success('All permissions granted. Proceeding...');
            navigate('/questionpage');
        } else {
            toast.error('Please grant all required permissions.');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-semibold mb-4 text-gray-700">Camera and Microphone Permission</h2>
                <div className="mb-4">
                    <video ref={videoRef} className="w-full h-auto border rounded" />
                </div>
                <button
                    onClick={handleProceed}
                    className={`w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 ${!isPermissionChecked && 'cursor-not-allowed opacity-50'}`}
                    disabled={!isPermissionChecked}
                >
                    Proceed
                </button>
            </div>
        </div>
    );
};

export default Cameracontroller;
