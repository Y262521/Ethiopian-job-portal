# Ethiopia Job Portal - React Frontend Migration

This project migrates the existing PHP-based Ethiopia Job Portal to a modern React frontend while keeping the PHP backend as API endpoints.

## 🚀 Project Structure

```
ethiopia-job-portal/
├── public/                 # Static files
├── src/                   # React source code
│   ├── components/        # Reusable components
│   ├── pages/            # Page components
│   ├── services/         # API service layer
│   └── App.js            # Main app component
├── api/                  # PHP API endpoints
├── package.json          # Dependencies
└── README.md            # This file
```

## 🛠 Technology Stack

### Frontend (New)
- **React 18** - Modern UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **CSS3** - Modern styling with Flexbox/Grid

### Backend (Existing)
- **PHP 7.4+** - Server-side logic (converted to APIs)
- **MySQL** - Database
- **PDO** - Database abstraction

## 📦 Installation & Setup

### Prerequisites
- Node.js 16+ and npm
- PHP 7.4+ and MySQL (existing)
- Web server (Apache/Nginx)

### Frontend Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm start
   ```
   The React app will run on `http://localhost:3000`

3. **Build for production:**
   ```bash
   npm run build
   ```

### Backend API Setup

1. **Ensure existing PHP backend is running**
2. **API endpoints are in the `/api` folder**
3. **Configure CORS if needed**

## 🔗 API Endpoints

The React frontend communicates with these PHP API endpoints:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/categories.php` | GET | Job categories with counts |
| `/api/featured-companies.php` | GET | Featured companies |
| `/api/jobs.php` | GET | Jobs with filtering/pagination |
| `/api/search.php` | GET | Job search functionality |
| `/api/login.php` | POST | User authentication |
| `/api/register.php` | POST | User registration |

## 🎨 Features Migrated

### ✅ Completed
- **Home Page** - Hero section, job categories, featured companies
- **Job Listings** - Search, filter, pagination
- **Company Listings** - Featured companies display
- **Authentication** - Login/signup forms
- **Responsive Design** - Mobile-first approach
- **API Integration** - React ↔ PHP communication

### 🚧 In Progress
- Job detail pages
- User dashboard
- Application system
- Admin panel

### 📋 To Do
- File upload functionality
- Email notifications
- Advanced search filters
- User profiles
- Company profiles

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root:

```env
REACT_APP_API_URL=http://localhost/ethiopiajob/api
REACT_APP_SITE_NAME=Ethiopia Job Portal
```

### API Configuration
Update `src/services/api.js` if your API base URL changes:

```javascript
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  timeout: 10000,
});
```

## 🎯 Key Components

### Core Components
- `Header.js` - Navigation and branding
- `Footer.js` - Site footer with links
- `SearchBar.js` - Job search functionality
- `JobCard.js` - Individual job display
- `JobCategories.js` - Category grid
- `FeaturedCompanies.js` - Company carousel

### Pages
- `Home.js` - Landing page
- `Jobs.js` - Job listings with filters
- `Companies.js` - Company directory
- `Login.js` - User authentication
- `Signup.js` - User registration
- `About.js` - About page
- `Contact.js` - Contact form

## 🔒 Security Features

- **CORS Headers** - Proper cross-origin configuration
- **Input Sanitization** - All user inputs sanitized
- **Password Hashing** - Secure password storage
- **JWT Tokens** - Stateless authentication
- **SQL Injection Prevention** - Prepared statements

## 📱 Responsive Design

The React frontend is fully responsive with:
- **Mobile-first** approach
- **Flexible grid** layouts
- **Touch-friendly** interfaces
- **Optimized images** and assets

## 🚀 Deployment

### Development
```bash
npm start
```

### Production Build
```bash
npm run build
```

### Deployment Options
1. **Static Hosting** - Netlify, Vercel, GitHub Pages
2. **Traditional Hosting** - Upload build folder to web server
3. **Docker** - Containerized deployment

## 🔄 Migration Benefits

### Performance
- **Faster loading** with React's virtual DOM
- **Code splitting** for optimized bundles
- **Caching strategies** for better performance

### Developer Experience
- **Modern tooling** with Create React App
- **Hot reloading** for faster development
- **Component reusability** and maintainability

### User Experience
- **Smooth navigation** with client-side routing
- **Interactive UI** with React state management
- **Better mobile experience** with responsive design

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure API endpoints have proper CORS headers
   - Check browser console for specific errors

2. **API Connection Issues**
   - Verify API base URL in configuration
   - Check PHP backend is running

3. **Build Errors**
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`
   - Check for syntax errors in components

## 📞 Support

For issues or questions:
- **Email**: admin@ethiopiajob.com
- **Phone**: +251973777477 | +251987756119

## 📄 License

© 2025 Ethiopia Job. All Rights Reserved.

---

## 🎉 Next Steps

1. **Test the React frontend** with existing PHP backend
2. **Migrate remaining pages** (job details, user dashboard)
3. **Implement advanced features** (file uploads, notifications)
4. **Optimize performance** (lazy loading, caching)
5. **Deploy to production** environment