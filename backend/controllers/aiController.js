// backend/controllers/aiController.js
const pool = require('../config/db');
const ss = require('simple-statistics');

exports.getReorderSuggestions = async (req, res) => {
    try {
        // Step 1: Fetch all historical sales data
        const salesQuery = `
            SELECT 
                p.id,
                p.name,
                i.quantity as currentStock,
                DATE(s.sale_date) as saleDay,
                SUM(si.quantity_sold) as dailyTotal
            FROM products p
            JOIN sale_items si ON p.id = si.product_id
            JOIN sales s ON si.sale_id = s.id
            JOIN inventory i ON p.id = i.product_id
            GROUP BY p.id, p.name, i.quantity, saleDay
            ORDER BY saleDay ASC;
        `;
        const [salesData] = await pool.query(salesQuery);

        // Step 2: Process the data to group all sales by product ID
        const salesByProduct = salesData.reduce((acc, sale) => {
            if (!acc[sale.id]) {
                acc[sale.id] = {
                    name: sale.name,
                    currentStock: sale.currentStock,
                    salesHistory: []
                };
            }
            const dayIndex = acc[sale.id].salesHistory.length;
            // --- THIS IS THE FIX: Convert dailyTotal from string to number ---
            acc[sale.id].salesHistory.push([dayIndex, parseInt(sale.dailyTotal, 10)]);
            return acc;
        }, {});

        // Step 3: For each product, predict future sales
        const suggestions = [];
        for (const productId in salesByProduct) {
            const product = salesByProduct[productId];
            
            if (product.salesHistory.length < 2) continue;

            const model = ss.linearRegression(product.salesHistory);
            const predictSales = ss.linearRegressionLine(model);

            let predictedSales = 0;
            const lastDayIndex = product.salesHistory.length - 1;
            for (let i = 1; i <= 7; i++) {
                const futureDayIndex = lastDayIndex + i;
                const dailyPrediction = predictSales(futureDayIndex);
                predictedSales += Math.max(0, dailyPrediction);
            }
            const predictedSalesNextWeek = Math.ceil(predictedSales);

            if (product.currentStock <= predictedSalesNextWeek) {
                suggestions.push({
                    productId: parseInt(productId),
                    name: product.name,
                    currentStock: product.currentStock,
                    predictedSales: predictedSalesNextWeek,
                    suggestion: `Stock is low. Predicted to sell ${predictedSalesNextWeek} units in the next 7 days.`
                });
            }
        }

        res.json(suggestions);

    } catch (error) {
        res.status(500).json({ message: 'Error generating AI suggestions.', error: error.message });
    }
};