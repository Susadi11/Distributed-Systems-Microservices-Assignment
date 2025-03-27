import React from 'react';
import Navbar from '../components/Utility/Navbar';
import Footer from "../components/Utility/Footer";
import {HeroSection} from "../components/Home/HeroSection";
import {FeaturedRestaurants} from "../components/Home/FeaturedRestaurants";
import {HowItWorks} from "../components/Home/HowItWorks";
import {MapSection} from "../components/Home/MapSection";
import FoodCategoriesCarousel from "../components/Home/FoodCategoriesCarousel";

export default function LandingPage() {
    return (
        <div>
            <Navbar />
            <HeroSection />
            <FoodCategoriesCarousel/>
            <MapSection />
            <FeaturedRestaurants />
            <HowItWorks />
            <Footer/>
        </div>
    );
}
