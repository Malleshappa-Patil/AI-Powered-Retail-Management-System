// src/components/AddProductModal.js
import React, { useState } from 'react';
import api from '../services/api';
import { CATEGORIES } from '../config';
import './AddProductModal.css';

const AddProductModal = ({ onClose, onProductAdded, preselectedCategory }) => {
    const [name, setName] = useState('');
    const [category, setCategory] = useState(preselectedCategory || CATEGORIES[0]);
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [description, setDescription] = useState('');
    const [tags, setTags] = useState('');
    const [image, setImage] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!image) {
            setError('Please select an image.');
            return;
        }
        setLoading(true);
        setError('');

        const formData = new FormData();
        formData.append('name', name);
        formData.append('category', category);
        formData.append('price', price);
        formData.append('quantity', quantity);
        formData.append('description', description);
        formData.append('tags', tags);
        formData.append('image', image);

        try {
            await api.post('/products', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            onProductAdded();
            onClose();
        } catch (err) {
            setError('Failed to add product. Please check the details.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>Add New Product</h2>
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder="Product Name" value={name} onChange={e => setName(e.target.value)} required />
                    <label>Category</label>
                    <select value={category} onChange={e => setCategory(e.target.value)} required>
                      {CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    <input type="number" step="0.01" placeholder="Price" value={price} onChange={e => setPrice(e.target.value)} required />
                    <input type="number" placeholder="Quantity" value={quantity} onChange={e => setQuantity(e.target.value)} required />
                    <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)}></textarea>
                    <input type="text" placeholder="Tags (comma-separated)" value={tags} onChange={e => setTags(e.target.value)} />
                    <label className="file-input-label">Product Image</label>
                    <input type="file" accept="image/*" onChange={e => setImage(e.target.files[0])} required />
                    <div className="modal-actions">
                        <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>Cancel</button>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Adding...' : 'Add Product'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProductModal;