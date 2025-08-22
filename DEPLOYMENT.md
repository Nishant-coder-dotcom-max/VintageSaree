# Deployment Guide for Vintage Saree House

## Backend Deployment

### Option 1: Heroku
1. **Create Heroku App:**
   ```bash
   heroku create your-app-name
   ```

2. **Set Environment Variables:**
   ```bash
   heroku config:set MONGODB_URI=your_mongodb_atlas_connection_string
   heroku config:set NODE_ENV=production
   ```

3. **Deploy:**
   ```bash
   git add .
   git commit -m "Deploy backend"
   git push heroku main
   ```

### Option 2: Railway
1. **Connect GitHub repository to Railway**
2. **Set Environment Variables:**
   - `MONGODB_URI`: Your MongoDB connection string
   - `NODE_ENV`: production
3. **Deploy automatically**

### Option 3: Render
1. **Create new Web Service**
2. **Connect GitHub repository**
3. **Set Environment Variables:**
   - `MONGODB_URI`: Your MongoDB connection string
   - `NODE_ENV`: production
4. **Deploy**

## Frontend Configuration

### Update Backend URL
After deploying your backend, update the URL in `public/config.js`:

```javascript
API_BASE_URL: 'https://your-actual-backend-url.herokuapp.com'
```

### Frontend Deployment
Deploy the `public/` folder to any static hosting service:
- Netlify
- Vercel
- GitHub Pages
- Firebase Hosting

## MongoDB Setup

### MongoDB Atlas (Recommended)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a cluster
3. Get connection string
4. Add to environment variables

### Local MongoDB
For development only:
```bash
mongod --dbpath /path/to/data/db
```

## Testing Deployment

1. **Test Backend:**
   ```bash
   curl https://your-backend-url.herokuapp.com/api/health
   ```

2. **Test Frontend:**
   - Open your deployed frontend
   - Try placing an order
   - Check browser console for errors

## Common Issues

### CORS Errors
If you get CORS errors, ensure your backend has:
```javascript
app.use(cors());
```

### MongoDB Connection
Make sure your MongoDB connection string is correct and accessible from your deployment platform.

### Environment Variables
Double-check all environment variables are set correctly in your deployment platform.

## Support
If you encounter issues:
1. Check deployment platform logs
2. Verify environment variables
3. Test API endpoints directly
4. Check browser console for frontend errors
