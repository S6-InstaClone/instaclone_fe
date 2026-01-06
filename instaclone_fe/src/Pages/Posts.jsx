import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPosts } from '../api/posts';
import { isLoggedIn, redirectToLogin } from '../auth';

export default function Posts() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadPosts();
    }, []);

    const loadPosts = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getPosts();
            setPosts(response.data || []);
        } catch (err) {
            console.error('Failed to load posts:', err);
            setError('Failed to load posts. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateClick = (e) => {
        if (!isLoggedIn()) {
            e.preventDefault();
            redirectToLogin();
        }
    };

    if (loading) {
        return (
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <p>Loading posts...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <p style={{ color: 'red' }}>{error}</p>
                <button onClick={loadPosts}>Retry</button>
            </div>
        );
    }

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1>Posts</h1>
                <Link
                    to="/create"
                    onClick={handleCreateClick}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        textDecoration: 'none',
                        borderRadius: '5px'
                    }}
                >
                    Create Post
                </Link>
            </div>

            {posts.length === 0 ? (
                <p>No posts yet. Be the first to create one!</p>
            ) : (
                <div style={{ display: 'grid', gap: '20px' }}>
                    {posts.map((post) => (
                        <div
                            key={post.id}
                            style={{
                                border: '1px solid #ddd',
                                borderRadius: '8px',
                                padding: '15px',
                                backgroundColor: '#fff'
                            }}
                        >
                            {post.imageUrl && (
                                <img
                                    src={post.imageUrl}
                                    alt="Post"
                                    style={{
                                        maxWidth: '100%',
                                        maxHeight: '400px',
                                        objectFit: 'cover',
                                        borderRadius: '4px'
                                    }}
                                />
                            )}
                            <div style={{
                                fontWeight: 'bold',
                                marginBottom: '0.5rem',
                                fontSize: '0.9rem',
                                color: '#646cff'
                            }}>
                                {post.username || 'unknown'}
                            </div> 
                            <p style={{ margin: '10px 0' }}>{post.caption}</p>
                            <div style={{ fontSize: '12px', color: '#999' }}>
                                Posted by: {post.userId || 'Unknown'}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}