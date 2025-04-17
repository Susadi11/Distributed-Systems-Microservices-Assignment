import React from 'react';
import Navbar from "../components/Utility/Navbar";
import Footer from "../components/Utility/Footer";
import Orders from "../components/Orders";

export default function RestaurantsList() {
    return (
        <div>
            <Navbar/>
            <Orders/>
            <Footer/>
        </div>
    );
}
