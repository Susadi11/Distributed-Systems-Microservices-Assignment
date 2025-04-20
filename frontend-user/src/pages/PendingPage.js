import React from 'react';
import Navbar from "../components/Utility/Navbar";
import Footer from "../components/Utility/Footer";
import Pending from "../components/Pending";

export default function RestaurantsList() {
    return (
        <div>
            <Navbar/>
            <Pending/>
            <Footer/>
        </div>
    );
}
