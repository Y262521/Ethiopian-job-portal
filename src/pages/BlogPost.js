import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './BlogPost.css';

const BlogPost = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [relatedPosts, setRelatedPosts] = useState([]);

    useEffect(() => {
        // Simulate loading blog post based on ID
        setTimeout(() => {
            const blogPosts = {
                1: {
                    id: 1,
                    title: "Top 10 Interview Tips for Ethiopian Job Seekers",
                    content: `
                        <p>Landing your dream job in Ethiopia requires more than just qualifications – you need to ace the interview. Here are our top 10 tips to help you succeed:</p>
                        
                        <h3>1. Research the Company Thoroughly</h3>
                        <p>Before your interview, spend time researching the company's history, values, recent news, and the specific role you're applying for. Ethiopian employers appreciate candidates who show genuine interest in their organization.</p>
                        
                        <h3>2. Prepare Your Documents</h3>
                        <p>Ensure you have all necessary documents ready: updated CV, certificates, references, and any portfolio items. In Ethiopia, having physical copies is often expected.</p>
                        
                        <h3>3. Dress Professionally</h3>
                        <p>First impressions matter. Dress conservatively and professionally, considering Ethiopian business culture and the specific industry you're applying to.</p>
                        
                        <h3>4. Practice Common Interview Questions</h3>
                        <p>Prepare answers for common questions like "Tell me about yourself," "Why do you want this job?" and "What are your strengths and weaknesses?"</p>
                        
                        <h3>5. Highlight Your Local Knowledge</h3>
                        <p>Demonstrate your understanding of the Ethiopian market, local challenges, and how your skills can contribute to the company's success in this context.</p>
                        
                        <h3>6. Show Cultural Awareness</h3>
                        <p>Respect Ethiopian business etiquette, including appropriate greetings, maintaining eye contact, and showing respect for hierarchy.</p>
                        
                        <h3>7. Prepare Questions to Ask</h3>
                        <p>Have thoughtful questions ready about the role, company culture, growth opportunities, and expectations. This shows your genuine interest.</p>
                        
                        <h3>8. Be Punctual</h3>
                        <p>Arrive 10-15 minutes early. Factor in Addis Ababa traffic or transportation challenges when planning your journey.</p>
                        
                        <h3>9. Demonstrate Problem-Solving Skills</h3>
                        <p>Be ready to discuss specific examples of how you've solved problems or overcome challenges in previous roles or situations.</p>
                        
                        <h3>10. Follow Up Professionally</h3>
                        <p>Send a thank-you email within 24 hours, reiterating your interest and highlighting key points from the interview.</p>
                        
                        <p>Remember, confidence combined with preparation is key to interview success. Good luck with your job search!</p>
                    `,
                    image: "/image/blog1.jpg",
                    date: "2025-01-20",
                    author: "Ethiopia Job Team",
                    category: "Career Tips",
                    readTime: "5 min read"
                },
                2: {
                    id: 2,
                    title: "How to Write a Winning CV in Ethiopia",
                    content: `
                        <p>Your CV is your first impression with potential employers. In Ethiopia's competitive job market, a well-crafted CV can make the difference between getting an interview and being overlooked.</p>
                        
                        <h3>Essential CV Sections</h3>
                        <p>Your Ethiopian CV should include: Personal Information, Professional Summary, Work Experience, Education, Skills, and References.</p>
                        
                        <h3>Personal Information</h3>
                        <p>Include your full name, phone number, email address, and city of residence. In Ethiopia, it's common to include your age and marital status.</p>
                        
                        <h3>Professional Summary</h3>
                        <p>Write a compelling 2-3 sentence summary highlighting your key qualifications and career objectives.</p>
                        
                        <h3>Work Experience</h3>
                        <p>List your work experience in reverse chronological order. Include company names, job titles, dates, and key achievements.</p>
                        
                        <h3>Education</h3>
                        <p>Include your educational background, starting with the highest degree. Mention the institution, degree, and graduation year.</p>
                        
                        <h3>Skills Section</h3>
                        <p>Highlight both technical and soft skills relevant to the position you're applying for.</p>
                        
                        <h3>References</h3>
                        <p>Include 2-3 professional references with their contact information, or state "References available upon request."</p>
                        
                        <h3>Formatting Tips</h3>
                        <p>Keep your CV to 1-2 pages, use a clean professional font, and ensure consistent formatting throughout.</p>
                        
                        <p>A well-written CV opens doors to opportunities. Take time to tailor it for each application!</p>
                    `,
                    image: "/image/blog2.jpg",
                    date: "2025-01-18",
                    author: "HR Expert",
                    category: "CV Writing",
                    readTime: "4 min read"
                },
                3: {
                    id: 3,
                    title: "Emerging Job Opportunities in Ethiopia 2025",
                    content: `
                        <p>Ethiopia's economy is rapidly evolving, creating new job opportunities across various sectors. Here are the key industries and roles to watch in 2025.</p>
                        
                        <h3>Technology Sector Growth</h3>
                        <p>The tech industry in Ethiopia is booming with opportunities in software development, digital marketing, data analysis, and cybersecurity.</p>
                        
                        <h3>Renewable Energy</h3>
                        <p>Ethiopia's commitment to green energy is creating jobs in solar, wind, and hydroelectric power projects.</p>
                        
                        <h3>Financial Services</h3>
                        <p>Mobile banking and fintech innovations are driving demand for financial analysts, product managers, and customer service specialists.</p>
                        
                        <h3>Healthcare Expansion</h3>
                        <p>Growing healthcare infrastructure needs nurses, medical technicians, healthcare administrators, and telemedicine specialists.</p>
                        
                        <h3>Agriculture Technology</h3>
                        <p>Modern farming techniques and agtech solutions are creating opportunities for agricultural engineers and farm management specialists.</p>
                        
                        <h3>Tourism and Hospitality</h3>
                        <p>Ethiopia's growing tourism industry needs hotel managers, tour guides, and hospitality professionals.</p>
                        
                        <h3>Education and Training</h3>
                        <p>Demand for skilled educators, vocational trainers, and e-learning specialists continues to grow.</p>
                        
                        <h3>Skills in Demand</h3>
                        <p>Digital literacy, English proficiency, project management, and analytical thinking are highly valued across all sectors.</p>
                        
                        <p>Stay ahead by developing skills in these growing areas and positioning yourself for Ethiopia's economic future!</p>
                    `,
                    image: "/image/blog3.jpg",
                    date: "2025-01-15",
                    author: "Market Analyst",
                    category: "Industry Trends",
                    readTime: "6 min read"
                },
                4: {
                    id: 4,
                    title: "Networking Strategies for Ethiopian Professionals",
                    content: `
                        <p>Building professional networks is crucial for career advancement in Ethiopia. Here's how to network effectively in the Ethiopian business environment.</p>
                        
                        <h3>Understanding Ethiopian Business Culture</h3>
                        <p>Respect for hierarchy, personal relationships, and trust-building are fundamental to successful networking in Ethiopia.</p>
                        
                        <h3>Professional Associations</h3>
                        <p>Join industry-specific associations like the Ethiopian Chamber of Commerce, professional engineering societies, or business groups.</p>
                        
                        <h3>Alumni Networks</h3>
                        <p>Connect with fellow graduates from your university or training programs. Alumni networks are particularly strong in Ethiopia.</p>
                        
                        <h3>Social Media Networking</h3>
                        <p>Use LinkedIn to connect with Ethiopian professionals, join local business groups, and share industry insights.</p>
                        
                        <h3>Attend Industry Events</h3>
                        <p>Participate in conferences, seminars, and workshops in Addis Ababa and other major cities.</p>
                        
                        <h3>Mentorship Opportunities</h3>
                        <p>Seek mentors in your field and also consider mentoring junior professionals to expand your network.</p>
                        
                        <h3>Community Involvement</h3>
                        <p>Participate in community service and professional development initiatives to meet like-minded professionals.</p>
                        
                        <h3>Follow-Up Strategies</h3>
                        <p>Maintain relationships through regular communication, sharing opportunities, and offering assistance when possible.</p>
                        
                        <p>Remember, networking is about building genuine relationships, not just collecting contacts. Invest time in meaningful connections!</p>
                    `,
                    image: "/image/blog4.jpg",
                    date: "2025-01-12",
                    author: "Career Coach",
                    category: "Networking",
                    readTime: "5 min read"
                }
            };

            const selectedPost = blogPosts[parseInt(id)] || blogPosts[1];
            setPost(selectedPost);

            // Set related posts (exclude current post)
            const allPosts = Object.values(blogPosts);
            const related = allPosts.filter(p => p.id !== selectedPost.id).slice(0, 3);
            setRelatedPosts(related);

            setLoading(false);
        }, 1000);
    }, [id]);

    if (loading) {
        return (
            <div className="blog-post-page">
                <div className="container">
                    <div className="loading">Loading blog post...</div>
                </div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="blog-post-page">
                <div className="container">
                    <div className="not-found">
                        <h2>Blog post not found</h2>
                        <Link to="/blog" className="btn btn-primary">Back to Blog</Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="blog-post-page">
            <div className="container">
                <div className="blog-post-header">
                    <Link to="/blog" className="back-link">
                        <i className="fas fa-arrow-left"></i> Back to Blog
                    </Link>
                    <div className="post-category">{post.category}</div>
                    <h1 className="post-title">{post.title}</h1>
                    <div className="post-meta">
                        <span className="post-author">By {post.author}</span>
                        <span className="post-date">{new Date(post.date).toLocaleDateString()}</span>
                        <span className="post-read-time">{post.readTime}</span>
                    </div>
                </div>

                <div className="blog-post-content">
                    <div className="post-image">
                        <img
                            src={post.image}
                            alt={post.title}
                            onError={(e) => {
                                e.target.src = '/image/default-blog.jpg';
                            }}
                        />
                    </div>

                    <div className="post-body">
                        <div dangerouslySetInnerHTML={{ __html: post.content }} />
                    </div>

                    <div className="post-footer">
                        <div className="post-tags">
                            <span className="tag">{post.category}</span>
                            <span className="tag">Career Advice</span>
                            <span className="tag">Ethiopia Jobs</span>
                        </div>

                        <div className="post-share">
                            <h4>Share this post:</h4>
                            <div className="share-buttons">
                                <a href="#" className="share-btn facebook">
                                    <i className="fab fa-facebook-f"></i>
                                </a>
                                <a href="#" className="share-btn twitter">
                                    <i className="fab fa-twitter"></i>
                                </a>
                                <a href="#" className="share-btn linkedin">
                                    <i className="fab fa-linkedin-in"></i>
                                </a>
                                <a href="#" className="share-btn whatsapp">
                                    <i className="fab fa-whatsapp"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="related-posts">
                    <h3>Related Posts</h3>
                    <div className="related-posts-grid">
                        {relatedPosts.map((relatedPost) => (
                            <Link
                                key={relatedPost.id}
                                to={`/blog/${relatedPost.id}`}
                                className="related-post-card"
                            >
                                <div className="related-post-image">
                                    <img
                                        src={relatedPost.image}
                                        alt={relatedPost.title}
                                        onError={(e) => {
                                            e.target.src = '/image/default-blog.jpg';
                                        }}
                                    />
                                </div>
                                <div className="related-post-content">
                                    <div className="related-post-category">{relatedPost.category}</div>
                                    <h4 className="related-post-title">{relatedPost.title}</h4>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogPost;