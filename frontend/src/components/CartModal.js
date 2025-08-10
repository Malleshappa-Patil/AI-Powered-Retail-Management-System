// frontend/src/components/CartModal.js
import React from 'react';
import { useCart } from '../context/CartContext';
import api from '../services/api';
import './CartModal.css';

const CartModal = ({ onClose, onCheckout }) => {
    const { cartItems, clearCart, increaseQuantity, decreaseQuantity } = useCart();

    const totalPrice = cartItems.reduce((total, item) => total + item.price * item.purchaseQuantity, 0);

    const handleCheckout = async () => {
        try {
            await api.post('/billing/checkout', { cartItems });
            alert('Checkout successful!');
            onCheckout(cartItems);
            clearCart();
        } catch (error) {
            const errorMessage = error.response?.data?.error || error.message || 'An unknown error occurred.';
            alert(`Checkout failed: ${errorMessage}`);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>Your Cart</h2>
                <div className="cart-items-list">
                    {cartItems.length === 0 ? <p>Your cart is empty.</p> : (
                        cartItems.map(item => (
                            <div key={item.id} className="cart-item">
                                <span className="cart-item-name">{item.name}</span>
                                <div className="cart-item-controls">
                                    <button onClick={() => decreaseQuantity(item.id)}>-</button>
                                    <span>{item.purchaseQuantity}</span>
                                    <button onClick={() => increaseQuantity(item.id)}>+</button>
                                </div>
                                {/* --- THIS LINE IS CHANGED --- */}
                                <span className="cart-item-price">₹{(item.price * item.purchaseQuantity).toFixed(2)}</span>
                            </div>
                        ))
                    )}
                </div>
                {cartItems.length > 0 && (
                    <div className="cart-total">
                        <span>Total</span>
                        {/* --- THIS LINE IS CHANGED --- */}
                        <span>₹{totalPrice.toFixed(2)}</span>
                    </div>
                )}
                <div className="modal-actions">
                    <button className="btn btn-secondary" onClick={onClose}>Close</button>
                    {cartItems.length > 0 && <button className="btn btn-primary" onClick={handleCheckout}>Generate Bill</button>}
                </div>
            </div>
        </div>
    );
};

export default CartModal;