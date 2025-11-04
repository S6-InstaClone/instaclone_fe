import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import PostList from './components/PostLists.jsx';
import PostFormPage from './components/PostFormPage.jsx';

function App() {
    return (
        <Router>
            <nav>
                <Link to="/">Posts</Link> | <Link to="/create">Create Post</Link>
            </nav>
            <Routes>
                <Route path="/" element={<PostList />} />
                <Route path="/create" element={<PostFormPage />} />
                <Route path="/edit/:id" element={<PostFormPage />} />
            </Routes>
        </Router>
    );
}

export default App;