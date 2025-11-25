import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createPost, updatePost, getPost } from '../api/posts';

function PostFormPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [caption, setCaption] = useState('');
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (id) {
            getPost(id).then(res => {
                setCaption(res.data.caption);
                setPreview(res.data.imageUrl);
            }).catch(err => {
                console.error('Failed to load post:', err);
                setError('Failed to load post');
            });
        }
    }, [id]);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        if (selectedFile) {
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result);
            reader.readAsDataURL(selectedFile);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append('Caption', caption);
        if (file) formData.append('File', file);
        // Note: UserId is NOT included - it comes from the JWT token via gateway

        if (id) {
            formData.append('Id', id);
        }

        try {
            if (id) {
                await updatePost(id, formData);
            } else {
                await createPost(formData);
            }
            navigate('/');
        } catch (err) {
            console.error('Failed to save post:', err);
            if (err.response?.status === 401) {
                setError('Please log in to create posts');
                navigate('/');
            } else if (err.response?.status === 403) {
                setError('You do not have permission to edit this post');
            } else {
                setError('Failed to save post. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>{id ? 'Edit' : 'Create'} Post</h2>

            {error && (
                <div style={{ color: 'red', marginBottom: '1rem' }}>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1rem' }}>
                    <input
                        type="text"
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        placeholder="Caption"
                        required
                        style={{ width: '100%', padding: '0.5rem' }}
                    />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                    <input
                        type="file"
                        onChange={handleFileChange}
                        accept="image/*"
                    />
                </div>

                {preview && (
                    <div style={{ marginBottom: '1rem' }}>
                        <img src={preview} alt="Preview" width="200" />
                    </div>
                )}

                <button type="submit" disabled={loading}>
                    {loading ? 'Saving...' : (id ? 'Update' : 'Create')} Post
                </button>
            </form>
        </div>
    );
}

export default PostFormPage;