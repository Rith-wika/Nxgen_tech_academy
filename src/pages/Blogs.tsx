import React, { useEffect, useState } from 'react';
import { SEO } from '@/components/SEO';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, User, Clock, ChevronRight, Eye, Share2, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHero } from '@/components/PageHero';
import { blogService } from '@/services/blogService';

const Blogs = () => {
    const [blogs, setBlogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            setLoading(true);
            const fetched = await blogService.getPublicBlogs();
            setBlogs(fetched);
        } catch (error) {
            console.error("Failed to fetch blogs from API:", error);
            setBlogs([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen font-sans bg-gray-50">
            <SEO
                title="Our Blogs & Insights - NxGen Tech Academy"
                description="Stay updated with the latest trends in IT, SAP, Data Science, and Career Advice from NxGen Tech Academy experts."
                type="website"
                path="/blogs"
            />

            <PageHero
                title="Our Latest Insights"
                description="Expert articles on Technology, Career Growth, and Industry Trends."
            >
                <div className="text-sm opacity-90 font-medium flex gap-2 items-center text-white">
                    <Link to="/" className="hover:text-gray-200 transition-colors">Home</Link>
                    <ChevronRight className="w-4 h-4" />
                    <span>Blogs</span>
                </div>
            </PageHero>

            {/* Blog Grid Section */}
            <section className="py-16 lg:py-24">
                <div className="container mx-auto px-4">
                    {loading ? (
                        <div className="text-center py-20 text-gray-500">Loading blogs...</div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {blogs.map((post) => (
                                <article
                                    key={post.id}
                                    className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group flex flex-col h-full"
                                >
                                    {/* Image Container */}
                                    <div className="relative h-48 overflow-hidden">
                                        <img
                                            src={post.image_url || post.image || "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=600&auto=format&fit=crop"}
                                            alt={post.title}
                                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute top-4 left-4">
                                            <span className="bg-[#000080] text-white text-xs font-bold px-3 py-1 rounded-full shadow-md w-max max-w-full">
                                                {post.category || "General"}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6 flex flex-col flex-grow">
                                        <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {post.created_at ? new Date(post.created_at).toLocaleDateString() : (post.date || 'Unknown Date')}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                5 min read
                                            </span>
                                        </div>

                                        <h2 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-[#000080] transition-colors">
                                            {post.title}
                                        </h2>

                                        <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed flex-grow">
                                            {post.excerpt}
                                        </p>

                                        <div className="flex items-center justify-between mt-auto">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                                                    <User className="w-4 h-4" />
                                                </div>
                                                <span className="text-xs font-medium text-gray-700">By {post.author_name || post.author || "Admin"}</span>
                                            </div>
                                            <Link
                                                to={`/blogs/${post.slug || post.id}`}
                                                className="text-[#000080] font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all"
                                            >
                                                Read More <ArrowRight className="w-4 h-4" />
                                            </Link>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}

                    {!loading && !blogs.length && (
                        <div className="text-center py-20">
                            <p className="text-gray-500 text-lg">No blog posts found.</p>
                        </div>
                    )}

                    {/* Pagination Placeholder */}
                    {!loading && blogs.length > 0 && (
                        <div className="mt-16 flex justify-center gap-2">
                            <Button variant="outline" className="border-gray-300 text-gray-600 hover:bg-gray-50" disabled>Previous</Button>
                            <Button className="bg-[#000080] hover:bg-[#000080]/90 text-white">1</Button>
                            <Button variant="outline" className="border-gray-300 text-gray-600 hover:bg-gray-50">Next</Button>
                        </div>
                    )}
                </div>
            </section>

            {/* Newsletter Section */}
            <section className="bg-gray-900 text-white py-16">
                <div className="container mx-auto px-4 text-center max-w-3xl">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">Subscribe to our Newsletter</h2>
                    <p className="text-gray-400 mb-8">Get the latest updates, articles, and resources sent straight to your inbox.</p>
                    <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto" onSubmit={(e) => e.preventDefault()}>
                        <input
                            type="email"
                            placeholder="Enter your email address"
                            className="flex-grow px-4 py-3 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#000080]"
                        />
                        <Button type="submit" size="lg" className="bg-[#000080] hover:bg-[#000080]/90 text-white font-medium">
                            Subscribe
                        </Button>
                    </form>
                </div>
            </section>
        </div>
    );
};

export default Blogs;