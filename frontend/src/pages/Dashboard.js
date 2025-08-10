// frontend/src/pages/Dashboard.js
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import Navbar from '../components/Navbar';
import CategoryNav from '../components/CategoryNav';
import AddProductModal from '../components/AddProductModal';
import EditProductModal from '../components/EditProductModal';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // --- ADDED: State for modals ---
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);

  const fetchAllProducts = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/products');
      setProducts(data);
      setError('');
    } catch (err){
      setError('Failed to fetch products.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllProducts();
  }, [fetchAllProducts]);

  // --- ADDED: Handler functions for Edit and Delete ---
  const handleDelete = async (productId) => {
    try {
        await api.delete(`/products/${productId}`);
        fetchAllProducts();
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
      <CategoryNav />
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Our Products</h1>
          {/* --- ADDED: Add Product button for admins --- */}
          {user.role === 'admin' && (
              <button className="btn btn-primary" onClick={() => setIsAddModalOpen(true)}>+ Add Product</button>
          )}
          {loading && <p>Loading...</p>}
        </div>
        
        
        {error && <p className="error-message">{error}</p>}

        <div className="product-grid">
          {products.map(product => (
            // --- UPDATED: Pass onEdit and onDelete props ---
            <ProductCard 
              key={product.id} 
              product={product}
              onEdit={handleOpenEditModal}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </div>

      {/* --- ADDED: Modals for Add and Edit functionality --- */}
      {isAddModalOpen && (
        <AddProductModal
          onClose={() => setIsAddModalOpen(false)}
          onProductAdded={fetchAllProducts}
        />
      )}
      {isEditModalOpen && (
        <EditProductModal
          product={currentProduct}
          onClose={handleCloseEditModal}
          onProductUpdated={fetchAllProducts}
        />
      )}
    </>
  );
};

export default Dashboard;