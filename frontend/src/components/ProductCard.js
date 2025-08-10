// src/components/ProductCard.js
import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../context/CartContext';
// import { FiStar } from 'react-icons/fi';
import './ProductCard.css';

const ProductCard = ({ product, onEdit, onDelete }) => {
    const { user } = useAuth();
    const { cartItems, addToCart } = useCart(); // Get cartItems and addToCart
    const imageSrc = product.metadata?.images?.[0] || 'https://via.placeholder.com/300x200.png?text=No+Image';

    // --- NEW LOGIC TO CALCULATE AVAILABLE STOCK ---
    // Find how many of this item are already in the cart
    const itemInCart = cartItems.find(item => item.id === product.id);
    const quantityInCart = itemInCart ? itemInCart.purchaseQuantity : 0;
    
    // The actual available stock is the total stock minus what's in the cart
    const availableStock = product.quantity - quantityInCart;
    const isOutOfStock = availableStock <= 0;

    const handleDeleteClick = () => {
        if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
            onDelete(product.id);
        }
    };
    
    // A new handler to provide specific feedback when trying to add more than available
    const handleAddToCart = () => {
        if (availableStock > 0) {
            addToCart(product);
        } else {
            // This alert is a fallback, as the button will be disabled, but it's good practice
            alert(`No more "${product.name}" in stock.`);
        }
    };

    return (
        <div className="product-card-zepto">
            <div className="product-image-container">
                <img src={imageSrc} alt={product.name} className="product-image-zepto" />
            </div>

            <div className="product-info-zepto">
                <h3 className="product-name-zepto">{product.name}</h3>
                
                {/* Display changes based on available stock */}
                {isOutOfStock ? (
                    <p className="out-of-stock">Out of Stock</p>
                ) : (
                    <p className="product-weight">Stock: {availableStock}</p>
                )}

                {/* <div className="product-rating">
                    <FiStar className="star-icon" />
                    <span>4.5 (1k+)</span>
                </div> */}

                <div className="product-price-section">
                    <div className="product-price-details">
                        <span className="product-price-zepto">₹{parseFloat(product.price).toFixed(2)}</span>
                    </div>
                    
                    <button 
                        className="add-btn-zepto" 
                        onClick={handleAddToCart} 
                        disabled={isOutOfStock}
                    >
                        ADD
                    </button>
                </div>
            </div>

            {user && user.role === 'admin' && (
                <div className="admin-actions-zepto">
                    <button onClick={() => onEdit(product)}>Edit</button>
                    <button onClick={handleDeleteClick}>Delete</button>
                </div>
            )}
        </div>
    );
};

export default ProductCard;