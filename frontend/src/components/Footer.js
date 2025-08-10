// frontend/src/components/Footer.js
import React from 'react';
import { Link } from 'react-router-dom';
import { CATEGORIES } from '../config';
import './Footer.css';

const Footer = () => {
    // We'll show the first 5 categories as an example
    const featuredCategories = CATEGORIES.slice(0, 5);

    return (
        <footer className="footer-container">
            <div className="footer-content">
                <div className="footer-column">
                    <h1 className="footer-logo">Inventory System</h1>
                    <p className="footer-tagline">Efficiently tracking every item.</p>
                </div>

                <div className="footer-column">
                    <h4>Useful Links</h4>
                    <ul>
                        <li><Link to="#">About Us</Link></li>
                        <li><Link to="#">Contact</Link></li>
                        <li><Link to="#">Terms & Conditions</Link></li>
                        <li><Link to="#">Privacy Policy</Link></li>
                    </ul>
                </div>

                <div className="footer-column">
                    <h4>Categories</h4>
                    <ul>
                        {featuredCategories.map(category => (
                            <li key={category}><Link to={`/category/${category}`}>{category}</Link></li>
                        ))}
                    </ul>
                </div>

                <div className="footer-column">
                    <h4>Contact Us</h4>
                    <p>123 Inventory St, Business City, 560100</p>
                    <p>Email: contact@inventory.com</p>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; 2025 Inventory System. All Rights Reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;