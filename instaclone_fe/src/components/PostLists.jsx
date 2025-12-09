import React, { useEffect, useState } from 'react';
import { getPosts, deletePost } from '../api/posts';
import PostForm from './PostForm';

function PostList() {
    const [posts, setPosts] = useState([]);
    const [editingPost, setEditingPost] = useState(null);

    const fetchPosts = async () => {
        const res = await getPosts();
        setPosts(res.data);
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleDelete = async (id) => {
        await deletePost(id);
        fetchPosts();
    };

    return (
        <div>
            <h1>Posts</h1>
            <PostForm onSuccess={fetchPosts} existingPost={editingPost} />
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {posts.map((post) => (
                    <li key={post.id} style={{
                        marginBottom: '1.5rem',
                        padding: '1rem',
                        border: '1px solid #333',
                        borderRadius: '8px'
                    }}>
                        {/* Username header */}
                        <div style={{
                            fontWeight: 'bold',
                            marginBottom: '0.5rem',
                            fontSize: '0.9rem',
                            color: '#646cff'
                        }}>
                            @{post.username || 'unknown'}
                        </div>

                        {/* Post image */}
                        {post.imageUrl && (
                            <img
                                src={post.imageUrl}
                                alt={post.caption}
                                style={{
                                    maxWidth: '100%',
                                    width: '300px',
                                    borderRadius: '4px',
                                    marginBottom: '0.5rem'
                                }}
                            />
                        )}

                        {/* Caption */}
                        <p style={{ margin: '0.5rem 0' }}>{post.caption}</p>

                        {/* Timestamp */}
                        <small style={{ color: '#888' }}>
                            {new Date(post.createdAt).toLocaleDateString()}
                        </small>

                        {/* Action buttons */}
                        <div style={{ marginTop: '0.5rem' }}>
                            <button onClick={() => setEditingPost(post)}>Edit</button>
                            <button
                                onClick={() => handleDelete(post.id)}
                                style={{ marginLeft: '0.5rem' }}
                            >
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default PostList;