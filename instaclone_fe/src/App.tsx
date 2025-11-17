import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import PostList from './components/PostLists.jsx';
import PostFormPage from './components/PostFormPage.jsx';
import ProfilePage from "./Pages/ProfilePage.jsx";

function App() {
    return (
        <Router>
            <nav>
                <Link to="/">Posts</Link> | <Link to="/create">Create Post</Link>
                <Link to="/">Profile</Link> | <Link to="/profile">Profile</Link>
            </nav>
            <Routes>
                <Route path="/" element={<PostList />} />
                <Route path="/create" element={<PostFormPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/edit/:id" element={<PostFormPage />} />
            </Routes>
        </Router>
    );
}

export default App;