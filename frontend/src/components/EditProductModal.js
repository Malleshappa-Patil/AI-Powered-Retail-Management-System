// frontend/src/components/EditProductModal.js
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './AddProductModal.css';

const EditProductModal = ({ product, onClose, onProductUpdated }) => {
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [image, setImage] = useState(null); // State for the new image file
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (product) {
            setName(product.name);
            setCategory(product.category);
            setPrice(product.price);
            setQuantity(product.quantity);
        }
    }, [product]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Step 1: Update the text-based product details
            const updatedProductDetails = { name, category, price, quantity };
            await api.put(`/products/${product.id}`, updatedProductDetails);

            // Step 2: If a new image was selected, upload it
            if (image) {
                const formData = new FormData();
                formData.append('image', image);
                await api.put(`/products/${product.id}/image`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
            }

            onProductUpdated(); // Callback to refresh the product list
            onClose(); // Close the modal

        } catch (err) {
            setError('Failed to update product.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (!product) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>Edit Product</h2>
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <label>Product Name</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} required />
                    <label>Category</label>
                    <input type="text" value={category} onChange={e => setCategory(e.target.value)} disabled />
                    <label>Price</label>
                    <input type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} required />
                    <label>Quantity</label>
                    <input type="number" value={quantity} onChange={e => setQuantity(e.target.value)} required />
                    
                    {/* --- THIS IS THE NEW PART --- */}
                    <label>Replace Image (optional)</label>
                    <input 
                        type="file" 
                        accept="image/*" 
                        onChange={e => setImage(e.target.files[0])} 
                    />
                    
                    <div className="modal-actions">
                        <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>Cancel</button>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProductModal;