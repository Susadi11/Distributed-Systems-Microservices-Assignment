import React from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
    const navigate = useNavigate();
    
    const handleRegisterClick = () => {
        navigate('/register');
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <button 
                onClick={handleRegisterClick}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
                Register
            </button>
        </div>
    );
}

export default Dashboard;