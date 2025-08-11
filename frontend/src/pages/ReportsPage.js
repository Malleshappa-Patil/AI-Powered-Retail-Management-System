// frontend/src/pages/ReportsPage.js
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import CategoryNav from '../components/CategoryNav';
import './ReportsPage.css';

const ReportsPage = () => {
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchSuggestions = async () => {
            try {
                setLoading(true);
                const { data } = await api.get('/ai/reorder-suggestions');
                setSuggestions(data);
                setError('');
            } catch (err) {
                setError('Failed to fetch AI suggestions.');
            } finally {
                setLoading(false);
            }
        };
        fetchSuggestions();
    }, []);

    return (
        <>
            <Navbar />
            <CategoryNav />
            <div className="reports-container">
                <div className="reports-header">
                    <h1>AI-Powered Insights</h1>
                    <p>Smart reordering suggestions based on sales forecasting.</p>
                </div>
                {loading && <p>Loading suggestions...</p>}
                {error && <p className="error-message">{error}</p>}
                <div className="suggestions-list">
                    {suggestions.length > 0 ? (
                        suggestions.map(item => (
                            <div key={item.productId} className="suggestion-card">
                                <h3>{item.name}</h3>
                                <p className="suggestion-details">
                                    <strong>Current Stock:</strong> {item.currentStock} <br />
                                    <strong>Predicted Sales (Next 7 Days):</strong> {item.predictedSales}
                                </p>
                                <p className="suggestion-advice">{item.suggestion}</p>
                            </div>
                        ))
                    ) : (
                        !loading && <p>No reorder suggestions at the moment. Check back after more sales are recorded.</p>
                    )}
                </div>
            </div>
        </>
    );
};

export default ReportsPage;