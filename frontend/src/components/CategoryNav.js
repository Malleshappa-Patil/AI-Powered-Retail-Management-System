// frontend/src/components/CategoryNav.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import { CATEGORIES } from '../config';
import { FiGrid, FiBox, FiCpu, FiGift, FiShoppingBag, FiLayers } from 'react-icons/fi';
import './CategoryNav.css';

// A simple function to get an icon for a category
const getCategoryIcon = (categoryName) => {
    switch (categoryName) {
        case "Fruits": return <FiGift />;
        case "Dry Fruits": return <FiBox />;
        case "Electronics": return <FiCpu />;
        case "Toys": return <FiGift />;
        case "Fashion": return <FiShoppingBag />;
        default: return <FiGrid />;
    }
};

const CategoryNav = () => {
    return (
        <div className="category-nav-container">
            <nav className="category-nav">
                {/* --- THIS IS THE NEW "ALL" LINK --- */}
                <NavLink
                    to="/dashboard"
                    end // 'end' prop ensures it's only active on the exact path
                    className={({ isActive }) => "category-nav-link" + (isActive ? " active" : "")}
                >
                    <FiLayers />
                    <span>All</span>
                </NavLink>

                {/* The rest of the categories */}
                {CATEGORIES.map(category => (
                    <NavLink
                        key={category}
                        to={`/category/${category}`}
                        className={({ isActive }) => "category-nav-link" + (isActive ? " active" : "")}
                    >
                        {getCategoryIcon(category)}
                        <span>{category}</span>
                    </NavLink>
                ))}
            </nav>
        </div>
    );
};

export default CategoryNav;