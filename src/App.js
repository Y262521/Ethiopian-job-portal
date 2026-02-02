import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';

// Public Pages
import Home from './pages/Home';
import Jobs from './pages/Jobs';
import Companies from './pages/Companies';
import Login from './pages/Login';
import Signup from './pages/Signup';
import About from './pages/About';
import Contact from './pages/Contact';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Pricing from './pages/Pricing';
import RequestDemo from './pages/RequestDemo';

// Employer Pages
import Employers from './pages/Employers';
import EmployerHome from './pages/EmployerHome';
import PostJobWorking from './pages/PostJobWorking';
import ManageJobs from './pages/ManageJobs';

// Components
import EmployerApplications from './components/EmployerApplications';

// User Pages (Job Seekers)
import UserHome from './pages/UserHome';
import MyApplications from './pages/MyApplications';
import Profile from './pages/Profile';
import SavedJobs from './pages/SavedJobs';
import JobAlerts from './pages/JobAlerts';

// Admin Pages
import Admin from './pages/Admin';
import AdminDashboard from './pages/AdminDashboard';
import Analytics from './pages/Analytics';
import JobModeration from './pages/JobModeration';
import NotificationSystem from './pages/NotificationSystem';
import AdminUserManagement from './pages/AdminUserManagement';
import PaymentManagement from './pages/PaymentManagement';
import DatabaseDashboard from './pages/DatabaseDashboard';
import AdminJobs from './pages/AdminJobs';

// Detail Pages
import JobDetail from './pages/JobDetail';
import CompanyDetail from './pages/CompanyDetail';
import JobApplicationPage from './pages/JobApplicationPage';

// Placeholder for missing pages
import PlaceholderPages from './pages/PlaceholderPages';

import './App.css';

function App() {
    return (
        <Router>
            <div className="App">
                <Header />
                <main className="main-content">
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<Home />} />
                        <Route path="/jobs" element={<Jobs />} />
                        <Route path="/job/:id" element={<JobDetail />} />
                        <Route path="/apply/:id" element={<JobApplicationPage />} />
                        <Route path="/companies" element={<Companies />} />
                        <Route path="/company/:id" element={<CompanyDetail />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/privacy" element={<PrivacyPolicy />} />
                        <Route path="/terms" element={<TermsOfService />} />
                        <Route path="/blog" element={<Blog />} />
                        <Route path="/blog/:id" element={<BlogPost />} />
                        <Route path="/pricing" element={<Pricing />} />
                        <Route path="/request-demo" element={<RequestDemo />} />

                        {/* Employer Routes */}
                        <Route path="/employers" element={<Employers />} />
                        <Route path="/employer/home" element={<EmployerHome />} />
                        <Route path="/employer/applications" element={<EmployerApplications />} />
                        <Route path="/employer/jobs" element={<ManageJobs />} />
                        <Route path="/post-job" element={<PostJobWorking />} />
                        <Route path="/employer-contact" element={<PlaceholderPages title="Employer Contact" />} />
                        <Route path="/job-management" element={<PlaceholderPages title="Job Management" />} />
                        <Route path="/reporting-analytics" element={<PlaceholderPages title="Reporting & Analytics" />} />

                        {/* User Routes (Authenticated Job Seekers) */}
                        <Route path="/user/home" element={<UserHome />} />
                        <Route path="/user/applications" element={<MyApplications />} />
                        <Route path="/user/saved-jobs" element={<SavedJobs />} />
                        <Route path="/user/job-alerts" element={<JobAlerts />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/user/profile" element={<Profile />} />
                        <Route path="/user/jobs" element={<PlaceholderPages title="My Jobs" />} />
                        <Route path="/user/companies" element={<PlaceholderPages title="My Companies" />} />
                        <Route path="/user/blog" element={<PlaceholderPages title="User Blog" />} />
                        <Route path="/user/contact" element={<PlaceholderPages title="User Contact" />} />
                        <Route path="/user/employers" element={<PlaceholderPages title="User Employers" />} />
                        <Route path="/user/pricing" element={<PlaceholderPages title="User Pricing" />} />
                        <Route path="/user/about" element={<PlaceholderPages title="User About" />} />
                        <Route path="/user/job-management" element={<PlaceholderPages title="User Job Management" />} />
                        <Route path="/user/reporting-analytics" element={<PlaceholderPages title="User Analytics" />} />
                        <Route path="/user/request-demo" element={<PlaceholderPages title="User Request Demo" />} />

                        {/* Admin Routes */}
                        <Route path="/admin" element={<Admin />} />
                        <Route path="/admin/dashboard" element={<AdminDashboard />} />
                        <Route path="/admin/jobs" element={<AdminJobs />} />
                        <Route path="/admin/database" element={<DatabaseDashboard />} />
                        <Route path="/admin/analytics" element={<Analytics />} />
                        <Route path="/admin/job-moderation" element={<JobModeration />} />
                        <Route path="/admin/user-management" element={<AdminUserManagement />} />
                        <Route path="/admin/notifications" element={<NotificationSystem />} />
                        <Route path="/admin/payments" element={<PaymentManagement />} />
                        <Route path="/admin/old-dashboard" element={<PlaceholderPages title="Admin Dashboard" />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
}

export default App;