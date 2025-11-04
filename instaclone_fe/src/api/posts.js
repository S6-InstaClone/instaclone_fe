import axios from 'axios';

const API_URL = 'http://localhost:5043/api/Posts'; // replace with your API endpoint

export const getPosts = () => axios.get(API_URL);

export const getPost = (id) => axios.get(`${API_URL}/${id}`);

export const createPost = (formData) =>
    axios.post(API_URL, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });

export const updatePost = (id, formData) =>
    axios.put(`${API_URL}/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });

export const deletePost = (id) => axios.delete(`${API_URL}/${id}`);