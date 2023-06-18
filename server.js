require('dotenv').config({path:"./config.env"})
const express = require('express');
const connectDb = require('./DB/db');

const app = express();
app.use(express.json());

// Import routes
const authRoutes = require('./Routes/authRoutes');
const orderRoutes = require('./Routes/orderRoutes');
const productRoutes = require('./Routes/productRoutes');


// Connect to the database
connectDb();

// Define routes
app.use('/api/auth', authRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/product', productRoutes);


// Start the server
const port = process.env.PORT ||5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
