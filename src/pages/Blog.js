import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Blog.css';

const Blog = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate loading blog posts
        setTimeout(() => {
            setPosts([
                {
                    id: 1,
                    title: "Top 10 Interview Tips for Ethiopian Job Seekers",
                    excerpt: "Master your next job interview with these proven strategies tailored for the Ethiopian job market.",
                    image: "/image/blog1.jpg",
                    date: "2025-01-20",
                    author: "Ethiopia Job Team",
                    category: "Career Tips"
                },
                {
                    id: 2,
                    title: "How to Write a Winning CV in Ethiopia",
                    excerpt: "Learn the essential elements of a compelling CV that will get you noticed by Ethiopian employers.",
                    image: "/image/blog2.jpg",
                    date: "2025-01-18",
                    author: "HR Expert",
                    category: "CV Writing"
                },
                {
                    id: 3,
                    title: "Emerging Job Opportunities in Ethiopia 2025",
                    excerpt: "Discover the fastest-growing industries and job opportunities in Ethiopia's evolving economy.",
                    image: "/image/blog3.jpg",
                    date: "2025-01-15",
                    author: "Market Analyst",
                    category: "Industry Trends"
                },
                {
                    id: 4,
                    title: "Networking Strategies for Ethiopian Professionals",
                    excerpt: "Build meaningful professional connections and advance your career through effective networking.",
                    image: "/image/blog4.jpg",
                    date: "2025-01-12",
                    author: "Career Coach",
                    category: "Networking"
                },
                {
                    id: 5,
                    title: "Remote Work Opportunities in Ethiopia",
                    excerpt: "Explore the growing remote work landscape and how to position yourself for remote opportunities.",
                    image: "/image/blog5.jpg",
                    date: "2025-01-10",
                    author: "Remote Work Expert",
                    category: "Remote Work"
                },
                {
                    id: 6,
                    title: "Salary Negotiation Tips for Ethiopian Workers",
                    excerpt: "Learn how to negotiate your salary effectively and get the compensation you deserve.",
                    image: "/image/blog6.jpg",
                    date: "2025-01-08",
                    author: "Compensation Specialist",
                    category: "Salary"
                }
            ]);
            setLoading(false);
        }, 1000);
    }, []);

    if (loading) {
        return (
            <div className="blog-page">
                <div className="container">
                    <div className="loading">Loading blog posts...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="blog-page">
            <div className="container">
                <div className="blog-header">
                    <h1>Career Blog</h1>
                    <p>Expert advice, industry insights, and career tips for Ethiopian professionals</p>
                </div>

                <div className="blog-grid">
                    {posts.map((post) => (
                        <article key={post.id} className="blog-card">
                            <Link to={`/blog/${post.id}`} className="blog-link">
                                <div className="blog-image">
                                    <img
                                        src={post.image}
                                        alt={post.title}
                                        onError={(e) => {
                                            e.target.src = '/image/default-blog.jpg';
                                        }}
                                    />
                                    <div className="blog-category">{post.category}</div>
                                </div>
                                <div className="blog-content">
                                    <h3 className="blog-title">{post.title}</h3>
                                    <p className="blog-excerpt">{post.excerpt}</p>
                                    <div className="blog-meta">
                                        <span className="blog-author">By {post.author}</span>
                                        <span className="blog-date">{new Date(post.date).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </Link>
                        </article>
                    ))}
                </div>

                <div className="blog-cta">
                    <h2>Stay Updated</h2>
                    <p>Subscribe to our newsletter for the latest career tips and job market insights</p>
                    <div className="newsletter-signup">
                        <input
                            type="email"
                            placeholder="Enter your email address"
                            className="newsletter-input"
                        />
                        <button className="btn btn-primary">Subscribe</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Blog;