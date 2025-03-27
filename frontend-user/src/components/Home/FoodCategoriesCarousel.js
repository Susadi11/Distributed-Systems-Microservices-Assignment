import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Extended food categories with icons (using emojis for simplicity)
const foodCategories = [
    { name: 'Desserts', icon: '🍰' },
    { name: 'Healthy', icon: '🥗' },
    { name: 'Chinese', icon: '🥡' },
    { name: 'Grocery', icon: '🛒' },
    { name: 'Convenience', icon: '🏪' },
    { name: 'Pizza', icon: '🍕' },
    { name: 'Burgers', icon: '🍔' },
    { name: 'Sushi', icon: '🍣' },
    { name: 'Italian', icon: '🍝' },
    { name: 'Mexican', icon: '🌮' },
    { name: 'Indian', icon: '🍛' },
    { name: 'Thai', icon: '🍜' },
    { name: 'Breakfast', icon: '🥞' },
    { name: 'BBQ', icon: '🍖' },
    { name: 'Seafood', icon: '🦞' },
    { name: 'Vegan', icon: '🌱' },
    { name: 'Salads', icon: '🥙' },
    { name: 'Smoothies', icon: '🥤' },
    { name: 'Coffee', icon: '☕' },
    { name: 'Bakery', icon: '🥐' }
];

const FoodCategoriesCarousel = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [categoriesPerView, setCategoriesPerView] = useState(5);
    const [showArrows, setShowArrows] = useState(false);
    const [activeCategory, setActiveCategory] = useState(0);

    // Calculate visible categories based on screen size
    useEffect(() => {
        const updateCategoriesPerView = () => {
            const screenWidth = window.innerWidth;
            let visibleCategories;

            if (screenWidth < 640) { // Mobile
                visibleCategories = 10;
            } else if (screenWidth < 768) { // Small tablet
                visibleCategories = 8;
            } else if (screenWidth < 1024) { // Tablet
                visibleCategories = 12;
            } else { // Desktop
                visibleCategories = 16;
            }

            setCategoriesPerView(visibleCategories);
            setShowArrows(foodCategories.length > visibleCategories);
        };

        updateCategoriesPerView();
        window.addEventListener('resize', updateCategoriesPerView);

        return () => {
            window.removeEventListener('resize', updateCategoriesPerView);
        };
    }, []);

    const nextSlide = () => {
        setCurrentSlide((prev) =>
            Math.min(prev + 1, foodCategories.length - categoriesPerView)
        );
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => Math.max(prev - 1, 0));
    };

    const handleCategoryClick = (index) => {
        setActiveCategory(index);
    };

    return (
        <div className="relative w-full mx-auto py-4 px-2">
            <div className="overflow-hidden">
                <div
                    className="flex transition-transform duration-300 ease-in-out"
                    style={{
                        transform: `translateX(-${currentSlide * (100 / categoriesPerView)}%)`,
                        width: `${(foodCategories.length / categoriesPerView) * 100}%`
                    }}
                >
                    {foodCategories.map((category, index) => (
                        <div
                            key={index}
                            className={`flex-shrink-0 px-2 text-center cursor-pointer rounded-lg transition-all ${
                                activeCategory === index ? 'scale-105' : ''
                            }`}
                            style={{ width: `${100 / categoriesPerView}%` }}
                            onClick={() => handleCategoryClick(index)}
                        >
                            <div className="flex flex-col items-center">
                                <div className={`text-2xl mb-1 p-2 rounded-full ${
                                    activeCategory === index ? 'bg-gray-100' : ''
                                }`}>
                                    {category.icon}
                                </div>
                                <span className={`text-xs font-medium ${
                                    activeCategory === index ? 'text-black font-semibold' : 'text-gray-600'
                                }`}>
                                    {category.name}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation Arrows - Only show if needed */}
            {showArrows && (
                <>
                    {currentSlide > 0 && (
                        <button
                            onClick={prevSlide}
                            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow-md rounded-full p-2 z-10 hover:bg-gray-100"
                        >
                            <ChevronLeft className="text-gray-600 h-5 w-5" />
                        </button>
                    )}

                    {currentSlide < foodCategories.length - categoriesPerView && (
                        <button
                            onClick={nextSlide}
                            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow-md rounded-full p-2 z-10 hover:bg-gray-100"
                        >
                            <ChevronRight className="text-gray-600 h-5 w-5" />
                        </button>
                    )}
                </>
            )}
        </div>
    );
};

export default FoodCategoriesCarousel;