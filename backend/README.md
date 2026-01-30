# Ethiopia Job Portal - Node.js Backend

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MySQL database
- npm or yarn

### Installation

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` file with your database credentials.

4. **Create database:**
   ```sql
   CREATE DATABASE ethiopia_job;
   ```

5. **Import database schema:**
   ```bash
   mysql -u root -p ethiopia_job < ../database/schema.sql
   ```

6. **Start the server:**
   ```bash
   # Development mode (with auto-restart)
   npm run dev

   # Production mode
   npm start
   ```

The API server will run on `http://localhost:5000`

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Jobs
- `GET /api/jobs` - Get all jobs (with filters)
- `GET /api/jobs/:id` - Get job by ID
- `GET /api/jobs/search` - Search jobs

### Companies
- `GET /api/companies` - Get all companies
- `GET /api/companies/featured` - Get featured companies
- `GET /api/companies/:id` - Get company by ID

### Categories
- `GET /api/categories` - Get all job categories
- `GET /api/categories/popular` - Get popular categories

### Users (Protected)
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

## 🔧 Configuration

### Environment Variables
```env
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=ethiopia_job
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h
FRONTEND_URL=http://localhost:3000
```

### Database Connection
The API uses MySQL with connection pooling for better performance.

### Security Features
- JWT authentication
- Password hashing with bcrypt
- Rate limiting
- CORS protection
- Input validation
- SQL injection prevention

## 🧪 Testing

Test the API endpoints:

```bash
# Health check
curl http://localhost:5000/api/health

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"userType":"jobseeker","firstName":"John","lastName":"Doe","email":"john@example.com","password":"password123","phone":"1234567890"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

## 📁 Project Structure

```
backend/
├── config/
│   └── database.js          # Database configuration
├── routes/
│   ├── auth.js             # Authentication routes
│   ├── jobs.js             # Job-related routes
│   ├── companies.js        # Company routes
│   ├── categories.js       # Category routes
│   └── users.js            # User profile routes
├── .env                    # Environment variables
├── .env.example           # Environment template
├── package.json           # Dependencies
├── server.js              # Main server file
└── README.md              # This file
```

## 🔄 Migration from PHP

The Node.js backend provides the same functionality as the PHP version:

- ✅ User registration and authentication
- ✅ Job listings with search and filters
- ✅ Company profiles and listings
- ✅ Category management
- ✅ JWT-based authentication
- ✅ Input validation and security
- ✅ Database connection pooling

## 🚨 Troubleshooting

### Common Issues

1. **Database connection failed:**
   - Check MySQL is running
   - Verify database credentials in `.env`
   - Ensure database exists

2. **Port already in use:**
   - Change PORT in `.env` file
   - Kill existing process: `lsof -ti:5000 | xargs kill`

3. **CORS errors:**
   - Check FRONTEND_URL in `.env`
   - Ensure React app runs on correct port

### Logs
The server logs all requests and errors to the console in development mode.