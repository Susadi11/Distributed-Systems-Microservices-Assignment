import React from 'react';
import Navbar from '../components/utility/Navbar';

function Home() {
    return (
        <>
            <Navbar />
            <div className="flex items-center justify-center h-screen bg-gradient-to-r ">
                <h1 className=" text-4xl font-bold">Hello, React!</h1>
            </div>
        </>
    );
}

export default Home;