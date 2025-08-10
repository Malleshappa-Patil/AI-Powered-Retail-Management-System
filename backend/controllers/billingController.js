// backend/controllers/billingController.js
const pool = require('../config/db');

exports.processCheckout = async (req, res) => {
    const { cartItems } = req.body;
    const userId = req.user.id; // Get the logged-in user's ID from the JWT

    if (!cartItems || cartItems.length === 0) {
        return res.status(400).json({ message: 'Cart is empty.' });
    }

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // 1. Calculate total amount
        const totalAmount = cartItems.reduce((total, item) => total + item.price * item.purchaseQuantity, 0);

        // 2. Create a record in the 'sales' table
        const [saleResult] = await connection.query(
            'INSERT INTO sales (user_id, total_amount) VALUES (?, ?)',
            [userId, totalAmount]
        );
        const saleId = saleResult.insertId;

        // 3. Update inventory and record each item in 'sale_items'
        await Promise.all(cartItems.map(async (item) => {
            // Check stock
            const [rows] = await connection.query('SELECT quantity FROM inventory WHERE product_id = ?', [item.id]);
            if (rows.length === 0 || rows[0].quantity < item.purchaseQuantity) {
                throw new Error(`Insufficient stock for product: ${item.name}`);
            }
            // Update inventory
            await connection.query(
                'UPDATE inventory SET quantity = quantity - ? WHERE product_id = ?',
                [item.purchaseQuantity, item.id]
            );
            // Record in sale_items
            await connection.query(
                'INSERT INTO sale_items (sale_id, product_id, quantity_sold, price_per_item) VALUES (?, ?, ?, ?)',
                [saleId, item.id, item.purchaseQuantity, item.price]
            );
        }));

        await connection.commit();
        res.status(200).json({ message: 'Checkout successful, inventory updated.' });

    } catch (error) {
        await connection.rollback();
        res.status(500).json({ message: 'Checkout failed.', error: error.message });
    } finally {
        connection.release();
    }
};