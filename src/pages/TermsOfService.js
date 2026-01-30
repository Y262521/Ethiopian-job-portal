import React from 'react';
import './TermsOfService.css';

const TermsOfService = () => {
    return (
        <div className="terms-of-service-page">
            <div className="container">
                <div className="terms-header">
                    <h1>Terms of Service</h1>
                    <p className="last-updated">Last updated: January 30, 2025</p>
                </div>

                <div className="terms-content">
                    <section className="terms-section">
                        <h2>1. Acceptance of Terms</h2>
                        <p>
                            By accessing and using Ethiopia Job ("the Platform"), you accept and agree to be bound by the terms
                            and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                        </p>
                    </section>

                    <section className="terms-section">
                        <h2>2. Description of Service</h2>
                        <p>
                            Ethiopia Job is an online platform that connects job seekers with employers in Ethiopia. We provide:
                        </p>
                        <ul>
                            <li>Job posting and search functionality</li>
                            <li>Company profiles and job seeker profiles</li>
                            <li>Application management tools</li>
                            <li>Communication features between employers and job seekers</li>
                            <li>Career resources and advice</li>
                        </ul>
                    </section>

                    <section className="terms-section">
                        <h2>3. User Accounts</h2>
                        <p>
                            To access certain features of the Platform, you must register for an account. You agree to:
                        </p>
                        <ul>
                            <li>Provide accurate, current, and complete information during registration</li>
                            <li>Maintain and update your information to keep it accurate and current</li>
                            <li>Maintain the security of your password and account</li>
                            <li>Accept responsibility for all activities under your account</li>
                            <li>Notify us immediately of any unauthorized use of your account</li>
                        </ul>
                    </section>

                    <section className="terms-section">
                        <h2>4. User Conduct</h2>
                        <p>You agree not to use the Platform to:</p>
                        <ul>
                            <li>Post false, misleading, or fraudulent job listings or profiles</li>
                            <li>Harass, abuse, or harm other users</li>
                            <li>Violate any applicable laws or regulations</li>
                            <li>Infringe on intellectual property rights</li>
                            <li>Distribute spam, viruses, or malicious content</li>
                            <li>Attempt to gain unauthorized access to our systems</li>
                            <li>Use automated tools to scrape or collect data</li>
                        </ul>
                    </section>

                    <section className="terms-section">
                        <h2>5. Job Postings and Applications</h2>
                        <h3>For Employers:</h3>
                        <ul>
                            <li>Job postings must be for legitimate employment opportunities</li>
                            <li>You must have the authority to hire for posted positions</li>
                            <li>Job descriptions must be accurate and complete</li>
                            <li>You agree to comply with all employment laws</li>
                        </ul>
                        <h3>For Job Seekers:</h3>
                        <ul>
                            <li>Profile information must be truthful and accurate</li>
                            <li>You may only apply for positions you are genuinely interested in</li>
                            <li>You agree to professional conduct in all communications</li>
                        </ul>
                    </section>

                    <section className="terms-section">
                        <h2>6. Payment Terms</h2>
                        <p>
                            Certain services on the Platform require payment. By using paid services, you agree to:
                        </p>
                        <ul>
                            <li>Pay all applicable fees as described in our pricing</li>
                            <li>Provide accurate billing information</li>
                            <li>Accept that fees are non-refundable unless otherwise stated</li>
                            <li>Understand that unpaid fees may result in service suspension</li>
                        </ul>
                    </section>

                    <section className="terms-section">
                        <h2>7. Intellectual Property</h2>
                        <p>
                            The Platform and its original content, features, and functionality are owned by Ethiopia Job and are
                            protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
                        </p>
                        <p>
                            You retain ownership of content you submit, but grant us a license to use, display, and distribute
                            your content on the Platform.
                        </p>
                    </section>

                    <section className="terms-section">
                        <h2>8. Privacy</h2>
                        <p>
                            Your privacy is important to us. Please review our Privacy Policy, which also governs your use of
                            the Platform, to understand our practices.
                        </p>
                    </section>

                    <section className="terms-section">
                        <h2>9. Disclaimers</h2>
                        <p>
                            The Platform is provided "as is" without warranties of any kind. We do not guarantee:
                        </p>
                        <ul>
                            <li>The accuracy or completeness of job postings or user profiles</li>
                            <li>That you will find employment or suitable candidates</li>
                            <li>Uninterrupted or error-free service</li>
                            <li>The conduct or qualifications of other users</li>
                        </ul>
                    </section>

                    <section className="terms-section">
                        <h2>10. Limitation of Liability</h2>
                        <p>
                            Ethiopia Job shall not be liable for any indirect, incidental, special, consequential, or punitive damages,
                            including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
                        </p>
                    </section>

                    <section className="terms-section">
                        <h2>11. Termination</h2>
                        <p>
                            We may terminate or suspend your account and access to the Platform immediately, without prior notice,
                            for conduct that we believe violates these Terms or is harmful to other users, us, or third parties.
                        </p>
                    </section>

                    <section className="terms-section">
                        <h2>12. Governing Law</h2>
                        <p>
                            These Terms shall be governed by and construed in accordance with the laws of Ethiopia,
                            without regard to its conflict of law provisions.
                        </p>
                    </section>

                    <section className="terms-section">
                        <h2>13. Changes to Terms</h2>
                        <p>
                            We reserve the right to modify these Terms at any time. We will notify users of any changes by
                            posting the new Terms on this page and updating the "Last updated" date.
                        </p>
                    </section>

                    <section className="terms-section">
                        <h2>14. Contact Information</h2>
                        <p>
                            If you have any questions about these Terms of Service, please contact us:
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

export default TermsOfService;