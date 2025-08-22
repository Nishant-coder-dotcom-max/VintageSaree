const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Order Schema
const orderSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    items: [{
        name: String,
        price: Number,
        quantity: Number,
        image: String
    }],
    totalAmount: {
        type: Number,
        required: true
    },
    shippingAddress: {
        street: String,
        city: String,
        state: String,
        pincode: String
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },
    orderDate: {
        type: Date,
        default: Date.now
    }
});

const Order = mongoose.model('Order', orderSchema);

// Generate unique order ID
function generateOrderId() {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `VS-${year}${month}${day}-${random}`;
}

// POST /api/orders - Create new order
router.post('/orders', async (req, res) => {
    try {
        const { name, phone, items, totalAmount, shippingAddress } = req.body;
        
        // Validate required fields
        if (!name || !phone || !items || !totalAmount) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: name, phone, items, totalAmount'
            });
        }

        // Generate unique order ID
        const orderId = generateOrderId();
        
        // Create new order
        const order = new Order({
            orderId,
            name,
            phone,
            items,
            totalAmount,
            shippingAddress: shippingAddress || {}
        });

        const savedOrder = await order.save();
        
        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            order: savedOrder
        });
        
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});

// GET /api/orders/:id - Get order by orderId
router.get('/orders/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const order = await Order.findOne({ orderId: id });
        
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }
        
        res.json({
            success: true,
            order
        });
        
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});

// GET /api/orders - Get all orders
router.get('/orders', async (req, res) => {
    try {
        const orders = await Order.find().sort({ orderDate: -1 });
        
        res.json({
            success: true,
            orders
        });
        
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});

// PUT /api/orders/:id/status - Update order status
router.put('/orders/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        if (!status) {
            return res.status(400).json({
                success: false,
                message: 'Status is required'
            });
        }
        
        const order = await Order.findOneAndUpdate(
            { orderId: id },
            { status },
            { new: true }
        );
        
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Order status updated successfully',
            order
        });
        
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});

// DELETE /api/orders/:id - Delete order
router.delete('/orders/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const order = await Order.findOneAndDelete({ orderId: id });
        
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Order deleted successfully'
        });
        
    } catch (error) {
        console.error('Error deleting order:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});

// Health check endpoint
router.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'Vintage Saree Backend is running',
        timestamp: new Date().toISOString()
    });
});

module.exports = router;
