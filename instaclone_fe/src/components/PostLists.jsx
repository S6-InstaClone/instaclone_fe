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
            <ul>
                {posts.map((post) => (
                    <li key={post.id}>
                        {post.imageUrl && <img src={post.imageUrl} alt={post.caption} width="100" />}
                        <p>{post.caption}</p>
                        <button onClick={() => setEditingPost(post)}>Edit</button>
                        <button onClick={() => handleDelete(post.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default PostList;
