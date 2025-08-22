// Backend API Configuration
const config = {
    // Update this URL to your deployed backend URL
    // Examples:
    // - Heroku: 'https://your-app-name.herokuapp.com'
    // - Railway: 'https://your-app-name.railway.app'
    // - Render: 'https://your-app-name.onrender.com'
    // - Vercel: 'https://your-app-name.vercel.app'
    // - Local: 'http://localhost:5000'
    
    API_BASE_URL: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
        ? 'http://localhost:5000' 
        : 'https://your-backend-url.herokuapp.com', // ⚠️ REPLACE WITH YOUR ACTUAL DEPLOYED BACKEND URL
    
    // API Endpoints
    ENDPOINTS: {
        ORDERS: '/api/orders',
        HEALTH: '/api/health'
    }
};

// Helper function to get full API URL
function getApiUrl(endpoint) {
    return `${config.API_BASE_URL}${endpoint}`;
}

// Export for use in other files
window.VintageSareeConfig = config;
window.getApiUrl = getApiUrl;
