// frontend/src/context/CartContext.js
import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    const addToCart = (product) => {
        if (product.quantity <= 0) return; // Do not add out-of-stock items

        setCartItems(prevItems => {
            const itemExists = prevItems.find(item => item.id === product.id);
            if (itemExists) {
                // Check if adding one more exceeds stock
                if (itemExists.purchaseQuantity < itemExists.quantity) {
                    return prevItems.map(item =>
                        item.id === product.id
                            ? { ...item, purchaseQuantity: item.purchaseQuantity + 1 }
                            : item
                    );
                } else {
                    alert(`Cannot add more of "${product.name}". Only ${product.quantity} in stock.`);
                    return prevItems; // Return unchanged
                }
            }
            // Add new item to cart with quantity 1
            return [...prevItems, { ...product, purchaseQuantity: 1 }];
        });
    };

    const increaseQuantity = (productId) => {
        setCartItems(prevItems =>
            prevItems.map(item => {
                if (item.id === productId) {
                    // Check if increasing exceeds stock
                    if (item.purchaseQuantity < item.quantity) {
                        return { ...item, purchaseQuantity: item.purchaseQuantity + 1 };
                    } else {
                        alert(`Cannot add more of "${item.name}". Only ${item.quantity} in stock.`);
                    }
                }
                return item;
            })
        );
    };

    const decreaseQuantity = (productId) => {
        setCartItems(prevItems => {
            const itemExists = prevItems.find(item => item.id === productId);
            if (itemExists.purchaseQuantity === 1) {
                return prevItems.filter(item => item.id !== productId);
            }
            return prevItems.map(item =>
                item.id === productId
                    ? { ...item, purchaseQuantity: item.purchaseQuantity - 1 }
                    : item
            );
        });
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const value = {
        cartItems,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};