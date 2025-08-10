// frontend/src/components/BillModal.js
import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import './AddProductModal.css';

const BillModal = ({ items, onClose }) => {
    const billRef = useRef();
    const totalPrice = items.reduce((total, item) => total + item.price * item.purchaseQuantity, 0);

    const handleDownload = () => {
        html2canvas(billRef.current).then(canvas => {
            const link = document.createElement('a');
            link.download = 'bill.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        });
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div ref={billRef} style={{padding: '20px', background: 'white'}}>
                    <h2>Invoice / Bill</h2>
                    <p>Date: {new Date().toLocaleDateString()}</p>
                    <hr/>
                    {items.map(item => (
                        <div key={item.id} style={{display: 'flex', justifyContent: 'space-between'}}>
                            <p>{item.name} (x{item.purchaseQuantity})</p>
                            {/* --- THIS LINE IS CHANGED --- */}
                            <p>₹{(item.price * item.purchaseQuantity).toFixed(2)}</p>
                        </div>
                    ))}
                    <hr/>
                    <div style={{display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.2rem'}}>
                        <p>Total Amount</p>
                        {/* --- THIS LINE IS CHANGED --- */}
                        <p>₹{totalPrice.toFixed(2)}</p>
                    </div>
                </div>
                <div className="modal-actions">
                    <button className="btn btn-secondary" onClick={onClose}>Close</button>
                    <button className="btn btn-primary" onClick={handleDownload}>Download Bill</button>
                </div>
            </div>
        </div>
    );
};

export default BillModal;