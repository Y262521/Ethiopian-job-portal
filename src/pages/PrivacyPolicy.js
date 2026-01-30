import React from 'react';
import './PrivacyPolicy.css';

const PrivacyPolicy = () => {
    return (
        <div className="privacy-policy-page">
            <div className="container">
                <div className="policy-header">
                    <h1>Privacy Policy</h1>
                    <p className="last-updated">Last updated: January 30, 2025</p>
                </div>

                <div className="policy-content">
                    <section className="policy-section">
                        <h2>1. Information We Collect</h2>
                        <p>
                            At Ethiopia Job, we collect information you provide directly to us, such as when you create an account,
                            apply for jobs, post job listings, or contact us for support.
                        </p>
                        <ul>
                            <li><strong>Personal Information:</strong> Name, email address, phone number, location</li>
                            <li><strong>Professional Information:</strong> Resume, work experience, education, skills</li>
                            <li><strong>Company Information:</strong> Company name, industry, job postings, company description</li>
                            <li><strong>Usage Information:</strong> How you interact with our platform, search queries, pages visited</li>
                        </ul>
                    </section>

                    <section className="policy-section">
                        <h2>2. How We Use Your Information</h2>
                        <p>We use the information we collect to:</p>
                        <ul>
                            <li>Provide and maintain our job matching services</li>
                            <li>Connect job seekers with potential employers</li>
                            <li>Send you relevant job alerts and notifications</li>
                            <li>Improve our platform and user experience</li>
                            <li>Communicate with you about our services</li>
                            <li>Ensure platform security and prevent fraud</li>
                        </ul>
                    </section>

                    <section className="policy-section">
                        <h2>3. Information Sharing</h2>
                        <p>
                            We do not sell, trade, or otherwise transfer your personal information to third parties without your consent,
                            except in the following circumstances:
                        </p>
                        <ul>
                            <li><strong>With Employers:</strong> When you apply for jobs, we share relevant profile information with employers</li>
                            <li><strong>Service Providers:</strong> We may share information with trusted service providers who assist in operating our platform</li>
                            <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
                        </ul>
                    </section>

                    <section className="policy-section">
                        <h2>4. Data Security</h2>
                        <p>
                            We implement appropriate security measures to protect your personal information against unauthorized access,
                            alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
                        </p>
                    </section>

                    <section className="policy-section">
                        <h2>5. Your Rights</h2>
                        <p>You have the right to:</p>
                        <ul>
                            <li>Access and update your personal information</li>
                            <li>Delete your account and associated data</li>
                            <li>Opt-out of marketing communications</li>
                            <li>Request a copy of your data</li>
                            <li>Lodge a complaint with relevant authorities</li>
                        </ul>
                    </section>

                    <section className="policy-section">
                        <h2>6. Cookies and Tracking</h2>
                        <p>
                            We use cookies and similar technologies to enhance your experience, analyze usage patterns,
                            and provide personalized content. You can control cookie settings through your browser preferences.
                        </p>
                    </section>

                    <section className="policy-section">
                        <h2>7. Data Retention</h2>
                        <p>
                            We retain your information for as long as necessary to provide our services and comply with legal obligations.
                            You may request deletion of your account at any time.
                        </p>
                    </section>

                    <section className="policy-section">
                        <h2>8. Children's Privacy</h2>
                        <p>
                            Our services are not intended for individuals under the age of 18. We do not knowingly collect
                            personal information from children under 18.
                        </p>
                    </section>

                    <section className="policy-section">
                        <h2>9. Changes to This Policy</h2>
                        <p>
                            We may update this Privacy Policy from time to time. We will notify you of any changes by posting
                            the new Privacy Policy on this page and updating the "Last updated" date.
                        </p>
                    </section>

                    <section className="policy-section">
                        <h2>10. Contact Us</h2>
                        <p>
                            If you have any questions about this Privacy Policy, please contact us:
                        </p>
                        <div className="contact-details">
                            <p><strong>Email:</strong> yonasteklu284@gmail.com</p>
                            <p><strong>Phone:</strong> +251962090308 | +251713224196</p>
                            <p><strong>Address:</strong> Addis Ababa, Ethiopia</p>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;