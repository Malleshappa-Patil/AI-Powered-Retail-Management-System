// src/pages/CategoryPage.js
import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api'; // This will now be used
import ProductCard from '../components/ProductCard';
import Navbar from '../components/Navbar';
import CategoryNav from '../components/CategoryNav'; // Import the new component
import AddProductModal from '../components/AddProductModal';
import EditProductModal from '../components/EditProductModal';
import './Dashboard.css';

const CategoryPage = () => {
    const { categoryName } = useParams();
    const { user } = useAuth();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);

    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);
            // We use encodeURIComponent to handle special characters like '&'
            const { data } = await api.get(`/products?category=${encodeURIComponent(categoryName)}`);
            setProducts(data);
            setError('');
        } catch (err) {
            setError('Failed to fetch products.');
        } finally {
            setLoading(false);
        }
    }, [categoryName]);


    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    // --- Full implementation of handler functions ---
    const handleDelete = async (productId) => {
        try {
            await api.delete(`/products/${productId}`);
            fetchProducts();
        } catch (err) {
            alert('Failed to delete product.');
        }
    };

    const handleOpenEditModal = (product) => {
        setCurrentProduct(product);
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setCurrentProduct(null);
        setIsEditModalOpen(false);
    };

    return (
        <>
            <Navbar />
            <CategoryNav/>
            <div className="dashboard-container">
                <div className="dashboard-header">
                    <h1>{categoryName}</h1>
                    <div>
                        {user.role === 'admin' && (
                            <button className="btn btn-primary" onClick={() => setIsAddModalOpen(true)}>+ Add Product</button>
                        )}
                    </div>
                </div>

                {loading && <p>Loading...</p>}
                {error && <p className="error-message">{error}</p>}

                {products.length > 0 ? (
                    <div className="product-grid">
                        {products.map(product => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                onEdit={handleOpenEditModal}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                ) : (
                    !loading && <p>No products found in this category.</p>
                )}
            </div>

            {isAddModalOpen && (
                <AddProductModal
                    preselectedCategory={categoryName}
                    onClose={() => setIsAddModalOpen(false)}
                    onProductAdded={fetchProducts}
                />
            )}
            {isEditModalOpen && (
                <EditProductModal
                    product={currentProduct}
                    onClose={handleCloseEditModal}
                    onProductUpdated={fetchProducts}
                />
            )}
        </>
    );
};

export default CategoryPage;