import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createPost, updatePost, getPost } from '../api/posts';

function PostFormPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [caption, setCaption] = useState('');
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        if (id) {
            getPost(id).then(res => {
                setCaption(res.data.caption);
                setPreview(res.data.imageUrl);
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
        const formData = new FormData();
        formData.append('Caption', caption);
        if (file) formData.append('File', file);
        if (id) formData.append('Id', id);

        try {
            if (id) {
                await updatePost(id, formData);
            } else {
                await createPost(formData);
            }
            navigate('/');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <h2>{id ? 'Edit' : 'Create'} Post</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="Caption"
                    required
                />
                <input type="file" onChange={handleFileChange} />
                {preview && <img src={preview} alt="Preview" width="200" />}
                <button type="submit">{id ? 'Update' : 'Create'} Post</button>
            </form>
        </div>
    );
}

export default PostFormPage;
