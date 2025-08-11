// backend/server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectMongo = require('./config/mongo');
const pool = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const productRoutes =require('./routes/productRoutes');
const billingRoutes = require('./routes/billingRoutes');
const aiRoutes = require('./routes/aiRoutes');

dotenv.config();

const app = express();

// Middleware
app.use(cors());

// --- THIS IS THE FIX ---
// Increase the limit to allow for larger payloads (like base64 images in the cart)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/ai', aiRoutes);

// Simple health check route
app.get('/', (req, res) => {
  res.send('Inventory API is running...');
});

const PORT = process.env.PORT || 5001;

const startServer = async () => {
  try {
    await connectMongo();
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to the database. Server not started.", error);
    process.exit(1);
  }
};

startServer();