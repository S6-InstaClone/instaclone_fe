import React, { useState } from 'react';
import { createPost, updatePost } from '../api/posts';

function PostForm({ existingPost, onSuccess }) {
    const [caption, setCaption] = useState(existingPost?.caption || '');
    const [file, setFile] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('Caption', caption);
        if (file) formData.append('File', file);
        if (existingPost) formData.append('Id', existingPost.id);

        try {
            if (existingPost) {
                await updatePost(existingPost.id, formData);
            } else {
                await createPost(formData);
            }
            onSuccess();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Caption"
                required
            />
            <input type="file" onChange={(e) => setFile(e.target.files[0])} />
            <button type="submit">{existingPost ? 'Update' : 'Create'} Post</button>
        </form>
    );
}

export default PostForm;
