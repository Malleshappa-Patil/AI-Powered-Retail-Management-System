const pool = require('../config/db');
const ProductMetadata = require('../models/productMetadata');
const Joi = require('joi');

const productSchema = Joi.object({
    name: Joi.string().min(3).required(),
    category: Joi.string().min(3).required(),
    price: Joi.number().positive().required(),
    quantity: Joi.number().integer().min(0).required(),
    description: Joi.string().allow('', null),
    tags: Joi.string().allow('', null), // Tags come as a comma-separated string from form-data
});

// Create a new product
exports.createProduct = async (req, res) => {
    const { error } = productSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { name, category, price, quantity, description } = req.body;
    const tags = req.body.tags ? req.body.tags.split(',').map(tag => tag.trim()) : [];

    if (!req.file) {
        return res.status(400).json({ message: 'Product image is required.' });
    }
    
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const [productResult] = await connection.query(
            'INSERT INTO products (name, category, price) VALUES (?, ?, ?)',
            [name, category, price]
        );
        const productId = productResult.insertId;

        await connection.query(
            'INSERT INTO inventory (product_id, quantity) VALUES (?, ?)',
            [productId, quantity]
        );
        
        const imageBase64 = req.file.buffer.toString('base64');
        const metadata = new ProductMetadata({
            productId,
            description,
            tags,
            images: [`data:${req.file.mimetype};base64,${imageBase64}`],
        });
        await metadata.save();
        
        await connection.commit();
        res.status(201).json({ message: 'Product created successfully', productId });

    } catch (err) {
        await connection.rollback();
        // Attempt to clean up MongoDB document if it was created before failure
        if (err.productId) {
            await ProductMetadata.deleteOne({ productId: err.productId });
        }
        res.status(500).json({ message: 'Server error', error: err.message });
    } finally {
        connection.release();
    }
};

// In backend/controllers/productController.js

// Get all products OR products by category
exports.getAllProducts = async (req, res) => {
    try {
        const { category } = req.query; // Check for a category query parameter

        let baseQuery = `
            SELECT p.id, p.name, p.category, p.price, i.quantity, i.last_updated 
            FROM products p 
            JOIN inventory i ON p.id = i.product_id
        `;
        const queryParams = [];

        if (category) {
            baseQuery += ' WHERE p.category = ?';
            queryParams.push(category);
        }

        baseQuery += ' ORDER BY p.name;';

        const [products] = await pool.query(baseQuery, queryParams);

        // This part for fetching metadata remains the same
        const productIds = products.map(p => p.id);
        const metadatas = await ProductMetadata.find({ productId: { $in: productIds } }).select('productId images description');
        
        const metadataMap = metadatas.reduce((map, meta) => {
            map[meta.productId] = meta;
            return map;
        }, {});

        const combinedProducts = products.map(p => ({
            ...p,
            metadata: metadataMap[p.id] || { images: [], description: '' }
        }));

        res.json(combinedProducts);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Update a product
exports.updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, category, price, quantity } = req.body;
    // Simple validation
    if (!name || !price || !quantity) {
        return res.status(400).json({ message: 'Missing required fields.' });
    }

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        await connection.query(
            'UPDATE products SET name = ?, category = ?, price = ? WHERE id = ?',
            [name, category, price, id]
        );
        await connection.query(
            'UPDATE inventory SET quantity = ? WHERE product_id = ?',
            [quantity, id]
        );
        await connection.commit();
        res.json({ message: 'Product updated successfully' });
    } catch (err) {
        await connection.rollback();
        res.status(500).json({ message: 'Server error', error: err.message });
    } finally {
        connection.release();
    }
};


// Delete a product
exports.deleteProduct = async (req, res) => {
    const { id } = req.params;
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        
        // --- THIS IS THE NEW LOGIC ---
        // Step 1: Delete any records of this product from past sales.
        // This is necessary because of the foreign key constraint.
        await connection.query('DELETE FROM sale_items WHERE product_id = ?', [id]);
        
        // Step 2: Delete the product from MongoDB metadata.
        await ProductMetadata.deleteOne({ productId: id });

        // Step 3: Now it's safe to delete the product itself.
        // The deletion from the `inventory` table happens automatically because of 'ON DELETE CASCADE'.
        await connection.query('DELETE FROM products WHERE id = ?', [id]);

        await connection.commit();
        res.json({ message: 'Product and all associated sales records deleted successfully' });

    } catch (err) {
        await connection.rollback();
        console.error("Delete product error:", err); // Added for better debugging
        res.status(500).json({ message: 'Server error', error: err.message });
    } finally {
        connection.release();
    }
};

// Generate and export low stock report as CSV
exports.getLowStockReport = async (req, res) => {
    const threshold = req.query.threshold || 10;
    try {
        const query = `
            SELECT p.id, p.name, p.category, i.quantity
            FROM products p
            JOIN inventory i ON p.id = i.product_id
            WHERE i.quantity <= ?;
        `;
        const [rows] = await pool.query(query, [threshold]);
        
        if (rows.length === 0) {
            return res.status(404).json({ message: 'No low stock items found.' });
        }

        // CSV conversion
        const csvHeader = 'ID,Name,Category,Quantity\n';
        const csvRows = rows.map(row => `${row.id},"${row.name}","${row.category}",${row.quantity}`).join('\n');
        const csv = csvHeader + csvRows;

        res.header('Content-Type', 'text/csv');
        res.attachment('low-stock-report.csv');
        res.send(csv);

    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Add this new function to backend/controllers/productController.js
exports.searchProducts = async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) {
            return res.status(400).json({ message: 'Search query is required.' });
        }

        const searchQuery = `
            SELECT p.id, p.name, p.category, p.price, i.quantity 
            FROM products p 
            JOIN inventory i ON p.id = i.product_id
            WHERE p.name LIKE ?
            ORDER BY p.name;
        `;
        // The '%' wildcards allow for partial matches
        const [products] = await pool.query(searchQuery, [`%${query}%`]);

        // This part for fetching metadata remains the same
        const productIds = products.map(p => p.id);
        const metadatas = await ProductMetadata.find({ productId: { $in: productIds } }).select('productId images');
        
        const metadataMap = metadatas.reduce((map, meta) => {
            map[meta.productId] = meta;
            return map;
        }, {});

        const combinedProducts = products.map(p => ({
            ...p,
            metadata: metadataMap[p.id] || { images: [] }
        }));

        res.json(combinedProducts);

    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.updateProductImage = async (req, res) => {
    const { id } = req.params;

    if (!req.file) {
        return res.status(400).json({ message: 'Product image is required.' });
    }

    try {
        const imageBase64 = req.file.buffer.toString('base64');
        const newImage = `data:${req.file.mimetype};base64,${imageBase64}`;

        // Find the product metadata and update the images array
        const result = await ProductMetadata.findOneAndUpdate(
            { productId: id },
            { $set: { images: [newImage] } }, // Replaces the entire images array
            { new: true }
        );

        if (!result) {
            return res.status(404).json({ message: 'Product metadata not found.' });
        }

        res.status(200).json({ message: 'Product image updated successfully.' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};