# Ethiopia Job Portal 🇪🇹

A modern, full-stack job portal application built with React and Node.js, specifically designed for the Ethiopian job market.

![Ethiopia Job Portal](https://img.shields.io/badge/Status-Production%20Ready-green)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![Database](https://img.shields.io/badge/Database-SQLite%2FPostgreSQL-orange)

## 🌟 Features

### For Job Seekers
- **User Registration & Authentication** - Secure account creation and login
- **Job Search & Filtering** - Advanced search with location, category, and experience filters
- **Job Applications** - Apply for jobs with CV upload and cover letters
- **Application Tracking** - Monitor application status and history
- **Profile Management** - Manage personal information and preferences

### For Employers
- **Company Profiles** - Showcase company information and culture
- **Job Posting** - Create detailed job listings with requirements and benefits
- **Application Management** - Review and manage job applications
- **Candidate Communication** - Respond to applications and schedule interviews
- **Dashboard Analytics** - Track job performance and application metrics

### For Administrators
- **User Management** - Manage job seekers, employers, and their accounts
- **Content Moderation** - Review and approve job postings
- **Payment Processing** - Handle subscription payments and transactions
- **Analytics & Reporting** - Generate platform usage and revenue reports
- **System Configuration** - Manage pricing plans and platform settings

## 🚀 Technology Stack

### Frontend
- **React 18.2.0** - Modern UI library with hooks
- **React Router 6** - Client-side routing
- **Axios** - HTTP client for API communication
- **CSS3** - Custom styling with responsive design
- **Font Awesome** - Icon library

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **SQLite/PostgreSQL** - Database (SQLite for development, PostgreSQL for production)
- **JWT** - JSON Web Tokens for authentication
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - API protection

### Deployment
- **Frontend**: Netlify (Recommended)
- **Backend**: Railway (Recommended)
- **Database**: PostgreSQL (Production)
- **File Storage**: Local/Cloud storage for CV uploads

## 📋 Prerequisites

Before running this project, make sure you have:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Git**

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/ethiopia-job-portal.git
cd ethiopia-job-portal
```

### 2. Install Frontend Dependencies
```bash
npm install
```

### 3. Install Backend Dependencies
```bash
cd backend
npm install
cd ..
```

### 4. Environment Configuration

#### Frontend (.env)
```bash
REACT_APP_API_URL=http://localhost:5000/api
```

#### Backend (backend/.env)
```bash
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
DATABASE_URL=./database.sqlite
```

### 5. Initialize Database
```bash
cd backend
npm run init-db  # If you have this script, otherwise the database will be created automatically
cd ..
```

### 6. Start Development Servers

#### Start Backend (Terminal 1)
```bash
cd backend
npm start
```

#### Start Frontend (Terminal 2)
```bash
npm start
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 🎯 Default Admin Account

For testing admin features:
- **Email**: admin@ethiopiajob.com
- **Password**: admin123456

## 📱 Screenshots

### Homepage
![Homepage](public/image/screenshot-home.png)

### Job Listings
![Job Listings](public/image/screenshot-jobs.png)

### Admin Dashboard
![Admin Dashboard](public/image/screenshot-admin.png)

## 🚀 Deployment

### Quick Deployment (15 minutes)

1. **Prepare for deployment**:
   ```bash
   npm run deploy:prep
   ```

2. **Deploy Backend to Railway**:
   - Visit [railway.app](https://railway.app)
   - Connect GitHub and deploy from repository
   - Set environment variables

3. **Deploy Frontend to Netlify**:
   - Visit [netlify.com](https://netlify.com)
   - Connect GitHub and deploy from repository
   - Set build command: `npm run build`

For detailed deployment instructions, see:
- [Quick Deploy Guide](QUICK_DEPLOY.md) - 15-minute setup
- [Comprehensive Deployment Guide](DEPLOYMENT_GUIDE.md) - All options

## 📁 Project Structure

```
ethiopia-job-portal/
├── public/                 # Static files
│   ├── image/             # Images and logos
│   └── index.html         # HTML template
├── src/                   # React source code
│   ├── components/        # Reusable components
│   ├── pages/            # Page components
│   ├── services/         # API services
│   └── App.js            # Main app component
├── backend/              # Node.js backend
│   ├── routes/           # API routes
│   ├── config/           # Database configuration
│   └── server.js         # Express server
├── .kiro/               # Kiro specifications
│   └── specs/           # Feature specifications
└── docs/                # Documentation
```

## 🔧 Available Scripts

### Frontend
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run deploy:prep` - Prepare for deployment

### Backend
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests

## 🌍 Localization

The application is designed for the Ethiopian market with:
- **Currency**: Ethiopian Birr (ETB)
- **Payment Methods**: TeleBirr, CBE Birr, Bank Transfer, Cash
- **Languages**: English (with Amharic support planned)
- **Local Companies**: Ethiopian Airlines, Commercial Bank of Ethiopia, etc.

## 🔐 Security Features

- **JWT Authentication** - Secure user sessions
- **Password Hashing** - bcrypt for password security
- **Rate Limiting** - Prevent API abuse
- **CORS Protection** - Secure cross-origin requests
- **Input Validation** - Prevent injection attacks
- **Helmet Security** - HTTP security headers

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Developer**: Your Name
- **Designer**: Your Name
- **Project Manager**: Your Name

## 📞 Support

For support and questions:
- **Email**: support@ethiopiajob.com
- **GitHub Issues**: [Create an issue](https://github.com/yourusername/ethiopia-job-portal/issues)
- **Documentation**: [Wiki](https://github.com/yourusername/ethiopia-job-portal/wiki)

## 🎉 Acknowledgments

- Ethiopian job market research
- Local payment gateway integrations
- Community feedback and testing
- Open source libraries and frameworks

## 📈 Roadmap

### Phase 1 (Current)
- ✅ Basic job posting and application system
- ✅ User authentication and profiles
- ✅ Admin dashboard
- ✅ Payment integration framework

### Phase 2 (Planned)
- 🔄 Real payment gateway integration
- 🔄 Advanced search and filtering
- 🔄 Email notifications
- 🔄 Mobile app development

### Phase 3 (Future)
- 📋 AI-powered job matching
- 📋 Video interviews
- 📋 Skills assessment tests
- 📋 Multi-language support

---

**Made with ❤️ for Ethiopia's job market**