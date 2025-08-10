// src/components/Navbar.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../context/CartContext';
import { FiSearch, FiUser, FiShoppingCart } from 'react-icons/fi';
import ProfileModal from './ProfileModal';
import SearchModal from './SearchModal';
import CartModal from './CartModal';
import BillModal from './BillModal';
import './Navbar.css';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { cartItems } = useCart();
    const navigate = useNavigate();

    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isBillOpen, setIsBillOpen] = useState(false);
    const [billedItems, setBilledItems] = useState([]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const cartItemCount = cartItems.reduce((count, item) => count + item.purchaseQuantity, 0);

    return (
        <>
            <nav className="new-navbar">
                <div className="nav-section nav-left">
                    <Link to="/dashboard" className="nav-logo">Inventory System</Link>
                </div>

                <div className="nav-section nav-center-search">
                    <div className="search-bar" onClick={() => setIsSearchOpen(true)}>
                        <FiSearch className="search-bar-icon" />
                        <span className="search-bar-text">Search for products...</span>
                    </div>
                </div>

                <div className="nav-section nav-right">
                    <div className="nav-icons">
                        <FiUser className="nav-icon" onClick={() => setIsProfileOpen(true)} />
                        <div className="nav-icon cart-icon-wrapper" onClick={() => setIsCartOpen(true)}>
                            <FiShoppingCart />
                            {user && cartItemCount > 0 && <span className="cart-badge">{cartItemCount}</span>}
                        </div>
                    </div>
                    <div className="nav-auth-buttons">
                        {user ? (
                            <>
                                {user.role === 'admin' && <span className="nav-user-greeting">({user.username})</span>}
                                <button onClick={handleLogout} className="nav-btn logout-btn">Logout</button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="nav-btn login-btn">Login</Link>
                                <Link to="/signup" className="nav-btn signup-btn">Sign Up</Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {isProfileOpen && <ProfileModal onClose={() => setIsProfileOpen(false)} />}
            {isSearchOpen && <SearchModal onClose={() => setIsSearchOpen(false)} />}
            {isCartOpen && (
                <CartModal 
                    onClose={() => setIsCartOpen(false)}
                    onCheckout={(finalItems) => {
                        setBilledItems(finalItems);
                        setIsCartOpen(false);
                        setIsBillOpen(true);
                    }}
                />
            )}
            {isBillOpen && (
                <BillModal 
                    items={billedItems}
                    onClose={() => setIsBillOpen(false)}
                />
            )}
        </>
    );
};

export default Navbar;