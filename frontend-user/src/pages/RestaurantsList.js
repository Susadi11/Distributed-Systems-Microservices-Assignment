import React from 'react';
import Navbar from "../components/Utility/Navbar";
import Footer from "../components/Utility/Footer";
import Restaurants from "../components/Restaurant/Restaurants";

export default function RestaurantsList() {
    return (
        <div>
            <Navbar/>
            <Restaurants/>
            <Footer/>
        </div>
    );
}
