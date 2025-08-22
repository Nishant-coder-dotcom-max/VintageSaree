# Vintage Saree House - Backend API

A Node.js + Express backend for order management with MongoDB integration.

## Features

- ✅ RESTful API for order management
- ✅ MongoDB integration with Mongoose
- ✅ Auto-generated unique order IDs
- ✅ CORS support for frontend integration
- ✅ Comprehensive error handling
- ✅ Order status tracking

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn

## Installation

1. **Clone or download the backend files**
2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp env.example .env
   ```
   Edit `.env` file with your MongoDB connection string.

4. **Start the server:**
   ```bash
   # Development mode (with auto-restart)
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

### 1. Create Order
**POST** `/api/orders`

**Request Body:**
```json
{
  "name": "John Doe",
  "phone": "+91-98765-43210",
  "items": [
    {
      "name": "Tant Saree",
      "price": 2500,
      "quantity": 1,
      "image": "images/saree1.webp"
    }
  ],
  "totalAmount": 2500,
  "shippingAddress": {
    "street": "123 Main Street",
    "city": "Kolkata",
    "state": "West Bengal",
    "pincode": "700001"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Order created successfully",
  "order": {
    "_id": "...",
    "orderId": "VS-231215-0001",
    "name": "John Doe",
    "phone": "+91-98765-43210",
    "items": [...],
    "totalAmount": 2500,
    "status": "pending",
    "orderDate": "2023-12-15T10:30:00.000Z"
  }
}
```

### 2. Get Order by ID
**GET** `/api/orders/:orderId`

**Response:**
```json
{
  "success": true,
  "order": {
    "_id": "...",
    "orderId": "VS-231215-0001",
    "name": "John Doe",
    "phone": "+91-98765-43210",
    "items": [...],
    "totalAmount": 2500,
    "status": "pending",
    "orderDate": "2023-12-15T10:30:00.000Z"
  }
}
```

### 3. Get All Orders
**GET** `/api/orders`

**Response:**
```json
{
  "success": true,
  "orders": [
    {
      "_id": "...",
      "orderId": "VS-231215-0001",
      "name": "John Doe",
      "status": "pending",
      "orderDate": "2023-12-15T10:30:00.000Z"
    }
  ]
}
```

### 4. Update Order Status
**PUT** `/api/orders/:orderId/status`

**Request Body:**
```json
{
  "status": "confirmed"
}
```

**Available Status Values:**
- `pending` (default)
- `confirmed`
- `shipped`
- `delivered`
- `cancelled`

### 5. Health Check
**GET** `/api/health`

**Response:**
```json
{
  "success": true,
  "message": "Vintage Saree Backend is running",
  "timestamp": "2023-12-15T10:30:00.000Z"
}
```

## Order Schema

```javascript
{
  orderId: String,        // Auto-generated unique ID (VS-YYMMDD-XXXX)
  name: String,           // Customer name
  phone: String,          // Customer phone number
  items: [{               // Array of ordered items
    name: String,         // Item name
    price: Number,        // Item price
    quantity: Number,     // Quantity ordered
    image: String         // Item image URL
  }],
  totalAmount: Number,    // Total order amount
  shippingAddress: {      // Shipping details
    street: String,
    city: String,
    state: String,
    pincode: String
  },
  status: String,         // Order status
  orderDate: Date         // Order creation date
}
```

## Frontend Integration

### Update your frontend to use the backend API:

```javascript
// Example: Creating an order from frontend
async function placeOrder(orderData) {
  try {
    const response = await fetch('http://localhost:5000/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData)
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log('Order created:', result.order);
      return result.order;
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('Error placing order:', error);
    throw error;
  }
}

// Example: Fetching order details
async function getOrder(orderId) {
  try {
    const response = await fetch(`http://localhost:5000/api/orders/${orderId}`);
    const result = await response.json();
    
    if (result.success) {
      return result.order;
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error;
  }
}
```

## MongoDB Setup

### Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. Use connection string: `mongodb://localhost:27017/vintage-saree`

### MongoDB Atlas (Cloud)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a cluster
3. Get connection string
4. Update `.env` file with Atlas connection string

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message (in development)"
}
```

## Development

- **Port:** 5000 (configurable via PORT environment variable)
- **Auto-restart:** Use `npm run dev` for development
- **Logs:** Check console for server status and error messages

## Production Deployment

1. Set up MongoDB Atlas or production MongoDB
2. Update environment variables
3. Use `npm start` to run in production mode
4. Consider using PM2 or similar process manager

## License

MIT License
