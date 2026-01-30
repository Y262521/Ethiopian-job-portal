import React, { useState } from 'react';
import './Contact.css';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Simulate form submission
        setTimeout(() => {
            setLoading(false);
            setSuccess(true);
            setFormData({ name: '', email: '', subject: '', message: '' });
        }, 1000);
    };

    return (
        <div className="contact-page">
            <div className="container">
                <div className="contact-header">
                    <h1>Contact Us</h1>
                    <p>Get in touch with our team</p>
                </div>

                <div className="contact-content">
                    <div className="contact-info">
                        <h2>Get In Touch</h2>
                        <p>
                            Have questions about our services? Need help with your account?
                            We're here to help you succeed in your career journey.
                        </p>

                        <div className="contact-details">
                            <div className="contact-item">
                                <i className="fas fa-phone"></i>
                                <div>
                                    <h4>Phone</h4>
                                    <p>+251962090308</p>
                                    <p>+251713224196</p>
                                </div>
                            </div>

                            <div className="contact-item">
                                <i className="fas fa-envelope"></i>
                                <div>
                                    <h4>Email</h4>
                                    <p>yonasteklu284@gmail.com</p>


                                </div>
                            </div>

                            <div className="contact-item">
                                <i className="fas fa-map-marker-alt"></i>
                                <div>
                                    <h4>Address</h4>
                                    <p>Addis Ababa, Ethiopia</p>
                                </div>
                            </div>

                            <div className="contact-item">
                                <i className="fas fa-clock"></i>
                                <div>
                                    <h4>Business Hours</h4>
                                    <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                                    <p>Saturday: 9:00 AM - 2:00 PM</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="contact-form-container">
                        <h2>Send us a Message</h2>

                        {success && (
                            <div className="success-message">
                                Thank you for your message! We'll get back to you soon.
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="contact-form">
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="form-input"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="form-input"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Subject</label>
                                <input
                                    type="text"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    className="form-input"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Message</label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="form-textarea"
                                    rows="6"
                                    required
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary btn-full"
                                disabled={loading}
                            >
                                {loading ? 'Sending...' : 'Send Message'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;