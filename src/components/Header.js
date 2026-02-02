import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is logged in
        const checkUser = () => {
            const userData = localStorage.getItem('user');
            if (userData) {
                try {
                    const parsedUser = JSON.parse(userData);
                    setUser(parsedUser);
                } catch (error) {
                    console.error('Error parsing user data:', error);
                    localStorage.removeItem('user');
                    setUser(null);
                }
            } else {
                setUser(null);
            }
        };

        // Initial check
        checkUser();

        // Listen for storage changes (when user logs in/out)
        const handleStorageChange = () => {
            checkUser();
        };

        // Listen for custom login event
        const handleUserLogin = () => {
            checkUser();
        };

        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('userLogin', handleUserLogin);
        window.addEventListener('userLogout', handleUserLogin);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('userLogin', handleUserLogin);
            window.removeEventListener('userLogout', handleUserLogin);
        };
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLogout = () => {
        // Clear all user data
        localStorage.removeItem('user');
        localStorage.removeItem('authToken');
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');

        // Reset user state
        setUser(null);

        // Dispatch custom event
        window.dispatchEvent(new Event('userLogout'));

        // Redirect to home
        navigate('/');
    };

    // Get the appropriate home URL based on user type
    const getHomeUrl = () => {
        if (!user) return '/'; // Public home for guests

        switch (user.type) {
            case 'jobseeker':
                return '/user/home';
            case 'employer':
                return '/employer/home';
            case 'admin':
                return '/admin';
            default:
                return '/'; // Fallback to public home
        }
    };

    return (
        <header className="header">
            <div className="container">
                <div className="header-content">
                    <Link to={getHomeUrl()} className="logo">
                        <h1>Ethiopia Job</h1>
                    </Link>

                    <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
                        <Link to={getHomeUrl()} className="nav-link">Home</Link>
                        <Link to="/jobs" className="nav-link">Find Jobs</Link>
                        <Link to="/companies" className="nav-link">Companies</Link>
                        <Link to="/blog" className="nav-link">Blog</Link>
                        <Link to="/about" className="nav-link">About</Link>
                        <Link to="/contact" className="nav-link">Contact</Link>
                    </nav>

                    <div className="header-actions">
                        {user ? (
                            // Logged in user navigation - simplified to Profile and Logout only
                            <div className="user-nav">
                                <Link
                                    to="/profile"
                                    className="btn btn-outline profile-btn"
                                >
                                    <i className="fas fa-user"></i>
                                    Profile
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="btn btn-danger logout-btn"
                                >
                                    <i className="fas fa-sign-out-alt"></i>
                                    Logout
                                </button>
                            </div>
                        ) : (
                            // Guest user navigation
                            <>
                                <Link to="/login" className="btn btn-outline">Login</Link>
                                <Link to="/signup" className="btn btn-primary">Sign Up</Link>
                            </>
                        )}
                    </div>

                    <button className="mobile-menu-btn" onClick={toggleMenu}>
                        <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;