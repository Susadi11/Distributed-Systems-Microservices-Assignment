import React from 'react';
import Navbar from '../components/Utility/Navbar';
import Footer from "../components/Utility/Footer";
import MyCart from "../components/MyCart";

export default function CartPage() {
    return (
        <div>
            <Navbar />
            <MyCart/>
            <Footer/>
        </div>
    );
}
