// frontend/src/components/SearchModal.js
import React, { useState } from 'react';
import api from '../services/api';
import ProductCard from './ProductCard';
import './AddProductModal.css';
import '../pages/Dashboard.css'; // Corrected CSS import path

const SearchModal = ({ onClose }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query) return;
        setLoading(true);
        try {
            const { data } = await api.get(`/products/search?query=${query}`);
            setResults(data);
        } catch (error) {
            console.error("Search failed", error);
            setResults([]); // Clear results on error
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content wide-modal" onClick={(e) => e.stopPropagation()}>
                <h2>Search Products</h2>
                <form onSubmit={handleSearch} className="search-form">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Enter product name..."
                    />
                    <button type="submit" className="btn btn-primary">Search</button>
                </form>
                <div className="search-results">
                    {loading ? <p>Searching...</p> : (
                        results.length > 0 ? (
                            <div className="product-grid">
                                {results.map(product => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <p>No results found.</p>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchModal;