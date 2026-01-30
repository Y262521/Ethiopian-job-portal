import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Pricing.css';

const Pricing = () => {
    const [employerPlans, setEmployerPlans] = useState([]);
    const [jobseekerPlans, setJobseekerPlans] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPricingPlans();
    }, []);

    const fetchPricingPlans = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/payments/plans');
            const data = await response.json();

            if (data.success) {
                const employers = data.plans.filter(plan => plan.type === 'employer');
                const jobseekers = data.plans.filter(plan => plan.type === 'jobseeker');

                setEmployerPlans(employers);
                setJobseekerPlans(jobseekers);
            }
        } catch (error) {
            console.error('Error fetching pricing plans:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectPlan = (plan) => {
        // Store selected plan and redirect to payment
        localStorage.setItem('selectedPlan', JSON.stringify(plan));

        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (!user.id) {
            alert('Please login to purchase a plan');
            return;
        }

        // Redirect to payment page (you can create this)
        window.location.href = `/payment?plan=${plan.id}`;
    };

    if (loading) {
        return (
            <div className="pricing-page">
                <div className="container">
                    <div className="loading">Loading pricing plans...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="pricing-page">
            <div className="container">
                {/* Header */}
                <div className="pricing-header">
                    <h1>Choose Your Plan</h1>
                    <p>Select the perfect plan for your needs and start your journey with Ethiopia Job</p>
                </div>

                {/* Employer Plans */}
                <section className="pricing-section">
                    <h2>🏢 For Employers</h2>
                    <p>Post jobs and find the best talent in Ethiopia</p>

                    <div className="plans-grid">
                        {employerPlans.map((plan) => (
                            <div key={plan.id} className={`plan-card ${plan.name.includes('Premium') ? 'featured' : ''}`}>
                                {plan.name.includes('Premium') && <div className="featured-badge">Most Popular</div>}

                                <div className="plan-header">
                                    <h3>{plan.name}</h3>
                                    <div className="price">
                                        <span className="amount">{plan.price}</span>
                                        <span className="currency">ETB</span>
                                    </div>
                                    <div className="duration">{plan.duration_days} days</div>
                                </div>

                                <div className="plan-features">
                                    <ul>
                                        {plan.features.map((feature, index) => (
                                            <li key={index}>
                                                <i className="fas fa-check"></i>
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <button
                                    className="plan-button"
                                    onClick={() => handleSelectPlan(plan)}
                                >
                                    Choose Plan
                                </button>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Job Seeker Plans */}
                <section className="pricing-section">
                    <h2>👤 For Job Seekers</h2>
                    <p>Apply for jobs and advance your career</p>

                    <div className="plans-grid">
                        {jobseekerPlans.map((plan) => (
                            <div key={plan.id} className={`plan-card ${plan.name.includes('Pro') ? 'featured' : ''}`}>
                                {plan.name.includes('Pro') && <div className="featured-badge">Best Value</div>}

                                <div className="plan-header">
                                    <h3>{plan.name}</h3>
                                    <div className="price">
                                        <span className="amount">{plan.price}</span>
                                        <span className="currency">ETB</span>
                                    </div>
                                    <div className="duration">{plan.duration_days} days</div>
                                </div>

                                <div className="plan-features">
                                    <ul>
                                        {plan.features.map((feature, index) => (
                                            <li key={index}>
                                                <i className="fas fa-check"></i>
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <button
                                    className="plan-button"
                                    onClick={() => handleSelectPlan(plan)}
                                >
                                    Choose Plan
                                </button>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Payment Methods */}
                <section className="payment-methods">
                    <h2>💳 Accepted Payment Methods</h2>
                    <div className="payment-grid">
                        <div className="payment-method">
                            <i className="fas fa-mobile-alt"></i>
                            <h4>TeleBirr</h4>
                            <p>Pay with TeleBirr mobile money</p>
                        </div>
                        <div className="payment-method">
                            <i className="fas fa-university"></i>
                            <h4>CBE Birr</h4>
                            <p>Commercial Bank of Ethiopia</p>
                        </div>
                        <div className="payment-method">
                            <i className="fas fa-money-check"></i>
                            <h4>Bank Transfer</h4>
                            <p>Direct bank transfer</p>
                        </div>
                        <div className="payment-method">
                            <i className="fas fa-hand-holding-usd"></i>
                            <h4>Cash Payment</h4>
                            <p>Pay at our office</p>
                        </div>
                    </div>
                </section>

                {/* FAQ */}
                <section className="faq-section">
                    <h2>❓ Frequently Asked Questions</h2>
                    <div className="faq-grid">
                        <div className="faq-item">
                            <h4>How do I pay for a plan?</h4>
                            <p>Select your plan, choose a payment method, and follow the instructions. Admin will confirm your payment within 24 hours.</p>
                        </div>
                        <div className="faq-item">
                            <h4>Can I change my plan later?</h4>
                            <p>Yes, you can upgrade or change your plan at any time. Contact support for assistance.</p>
                        </div>
                        <div className="faq-item">
                            <h4>What happens after payment?</h4>
                            <p>Once payment is confirmed, your plan will be activated immediately and you can start using the features.</p>
                        </div>
                        <div className="faq-item">
                            <h4>Do you offer refunds?</h4>
                            <p>Refunds are available within 7 days of purchase if you haven't used the plan features.</p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Pricing;