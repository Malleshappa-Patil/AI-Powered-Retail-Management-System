// frontend/src/components/ProfileModal.js
import React from 'react';
import { useAuth } from '../hooks/useAuth';
import './AddProductModal.css'; // Reusing modal styles

const ProfileModal = ({ onClose }) => {
    const { user } = useAuth();

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>Your Profile</h2>
                {user ? (
                    <div className="profile-details">
                        <p><strong>Username:</strong> {user.username}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Role:</strong> {user.role}</p>
                    </div>
                ) : (
                    <p>Not logged in.</p>
                )}
                <div className="modal-actions">
                    <button className="btn btn-secondary" onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
};

export default ProfileModal;